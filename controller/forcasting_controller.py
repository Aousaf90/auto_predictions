from fastapi import APIRouter, File, UploadFile, Depends, Form, HTTPException, Header
from fastapi.responses import FileResponse, StreamingResponse
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from sqlalchemy.orm import Session
from prophet import Prophet
import re
import json
import os
import pandas as pd
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from sse_starlette.sse import EventSourceResponse
import asyncio
from langchain_core.prompts import ChatPromptTemplate
import math
from langchain.embeddings import OpenAIEmbeddings
from langchain_postgres import PGVector
from langchain.document_loaders import CSVLoader
from langchain.text_splitter import CharacterTextSplitter
from datetime import datetime
from typing import Dict

import dotenv
from schemas.forcasting import ChatQuestion
from helper.forcasting import (
    load_document,
    get_groq_respons,
    make_prediction,
    llama_chatbot,
    delete_file,
    pg_vector,
)
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from database import get_db, DATABASE_URL, create_engine, engine
from models.auth import File as FileModel, Token, User

forecasting = APIRouter()

# embeddings
embeddings = GoogleGenerativeAIEmbeddings(
    google_api_key="AIzaSyDb8x0zZsSs-bGcRM1AnXI4YxwwQ6dnfTQ",
    model="models/text-embedding-004",
)
pg_vector = PGVector(
    embeddings=embeddings,
    # collection_name="Test Embeddings",
    connection=DATABASE_URL,
    use_jsonb=True,
)


def load_csv_file(path):
    loader = CSVLoader(path)
    splited_csv = loader.load_and_split()
    return splited_csv


def get_token(authentication: str = Header(...)):
    if not authentication or not authentication.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token missing or invalid")
    token = authentication.split(" ")[1]
    return token


def split_document_content(document):
    """
    Split the content of a document into chunks.
    Args:
        document: The document to split.
    Returns:
        A list of document chunks.
    """
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs = text_splitter.split_documents(document)
    return docs


dotenv.load_dotenv()


@forecasting.post("/chat/{file_id}")
async def model_chat(
    file_id: int,
    chat_question: ChatQuestion,
    db: Session = Depends(get_db),
    # token=Depends(get_token),
):
    # active_user = db.query(Token).filter(Token.token == token).first()
    # if not active_user:
    #     raise HTTPException(status_code=401, detail="Invalid token")

    csv_file = db.query(FileModel).filter(FileModel.id == file_id).first()
    WORKING_DIR = os.getcwd()
    upload_folder = os.path.join(WORKING_DIR, "uploads")
    file_path = os.path.join(upload_folder, csv_file.file_name)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
    data_frame = pd.read_csv(file_path)
    csv_data = data_frame.to_dict(orient="records")
    response_data = ""
    search_results = pg_vector.similarity_search(query=chat_question.question, k=2)
    print("Search Result", search_results)
    # search_result = pg_vector.similarity_search(query=chat_question.question,k=10)
    #
    for response in get_groq_respons(chat_question, search_results):
        response_data += response

    return response_data
    # return response_data
    # async def event_stream():
    #     for response in get_groq_respons(chat_question, []):
    #         yield f"{response}\n"

    # return StreamingResponse(event_stream(), media_type="text/event-stream")


@forecasting.delete("/delete_file/{file_id}")
def delete_file(file_id: int, db: Session = Depends(get_db), token=Depends(get_token)):
    try:
        active_user = db.query(Token).filter(Token.token == token).first()
        if not active_user:
            raise HTTPException(status_code=401, detail="Invalid token")
        file = db.query(FileModel).filter(FileModel.id == file_id).first()
        if not file:
            raise HTTPException(status_code=404, detail=f"File not found: {file_id}")
        db.delete(file)
        db.commit()
        delete_file(file.file_name)

        return {"message": f"File {file_id} deleted successfully."}
    except Exception as e:
        pass


def find_monthly_average(dataframe):
    try:
        # df = pd.read_csv(csv_path)
        df = dataframe
        df["ds"] = pd.to_datetime(df["ds"])
        df["Month"] = df["ds"].dt.strftime("%Y-%m")
        monthly_avg = df.groupby("Month")["yhat"].mean().reset_index()
        monthly_avg.columns = ["Month", "Average"]
        return monthly_avg
    except Exception as e:
        raise HTTPException(
            detail=f"The available data is insufficient to generate accurate predictions.",
            status_code=400,
        )


@forecasting.get("/get-files")
def get_files(db: Session = Depends(get_db), token=Depends(get_token)):
    """
    Get all uploaded files.

    Returns:
    - files (List[FileModel]): List of uploaded files.
    """
    active_user = db.query(Token).filter(Token.token == token).first()
    user = db.query(User).filter(User.id == active_user.user_id).first()

    if not active_user:
        raise HTTPException(status_code=401, detail="Invalid token")
    files = db.query(FileModel).filter(FileModel.user_id == active_user.user_id).all()
    return {"files": files, "user": user}


def extract_json(input_string):
    json_match = re.search(r"```(.*?)```", input_string, re.DOTALL)
    if json_match:
        json_str = json_match.group(1).strip()
        try:
            parsed_json = json.loads(json_str)
            return parsed_json
        except json.JSONDecodeError:
            return None
    return None


def llama__prediction_chatbot(csv_data: list):
    json_format = """
        {
             'fields': ['date_field', 'other_field', ...]
        }
    """
    formatted_data = "\n".join([str(item) for item in csv_data])

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "user",
                """Given the provided CSV data, please identify and list
         2 potential fields that can be utilized to represent values on a graph.
         The value should be of numeric type and it can also be used for prediction through the Prophet library.
         Mostly for prediction, we use one value for datetime and another for something else.
         Note: One of the fields should be date.
         CSV Data:
         {formatted_data}
         Return only field names, no extra words.
         Return in JSON format:
         {json_format}
         """,
            )
        ]
    )

    model = ChatGroq(
        model="llama3-8b-8192",
        temperature=0.7,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        api_key="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",
    )

    chain = prompt | model | StrOutputParser()

    stream = chain.invoke(
        {"formatted_data": formatted_data, "json_format": json_format}
    )

    return extract_json(stream)


def get_product_name(csv_data: list):
    formatted_data = "\n".join([str(item) for item in csv_data])
    json_format = json.dumps({"fields_name": "field_name"})
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "user",
                """Given the provided CSV data, please identify the field that is most suitable for products in the CSV.
        CSV Data:
        {formatted_data}
        Return ONLY the JSON format below:
        {json_format}""",
            )
        ]
    )

    model = ChatGroq(
        model="llama3-8b-8192",
        temperature=0.7,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        api_key="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",
    )

    chain = prompt | model | StrOutputParser()
    stream = chain.invoke(
        {"formatted_data": formatted_data, "json_format": json_format}
    )
    return extract_json(stream)


@forecasting.get("/generate_prediction/{file_id}/{forecast_period}")
async def generate_prediction_file(
    file_id: int, forecast_period: int, db: Session = Depends(get_db)
):
    async def event_generator():
        file = db.query(FileModel).filter(FileModel.id == file_id).first()
        print(f"Stage:::: 1")
        yield {"data": json.dumps({"status": 10, "message": "Initializing prediction"})}
        await asyncio.sleep(0)
        if not file:
            yield {
                "event": "error",
                "data": json.dumps({"status": 0, "message": "File not found"}),
            }
            return

        upload_folder = os.path.join(os.getcwd(), "uploads")
        csv_file = os.path.join(upload_folder, file.file_name)
        print(f"Stage:::: 2")
        yield {"data": json.dumps({"status": 20, "message": "Analyzing CSV file..."})}
        await asyncio.sleep(0)

        dataframe = pd.read_csv(csv_file)
        await asyncio.sleep(0)

        while True:
            try:
                field_data = llama__prediction_chatbot(dataframe[:5])["fields"]
                break
            except Exception as e:
                print(f"Error while extracting json data: {e}")
                await asyncio.sleep(1)
                continue
        await asyncio.sleep(0)

        print(f"Stage:::: 3")
        yield {"data": json.dumps({"status": 30, "message": "Analysis finished..."})}
        await asyncio.sleep(0)
        unique_descriptions = dataframe["Description"].unique()
        try:
            all_predictions = []
            total_descriptions = len(unique_descriptions)
            yield {
                "data": json.dumps(
                    {
                        "status": 40,
                        "message": "Generating predictions for each product...",
                    }
                )
            }
            await asyncio.sleep(0)
            for index, description in enumerate(unique_descriptions):
                description_data = dataframe[dataframe["Description"] == description]
                try:
                    predicted_data_frame = make_prediction(
                        dataframe=description_data,
                        fields=field_data,
                        prediction_period=forecast_period,
                    )
                    await asyncio.sleep(0)
                    monthly_average = find_monthly_average(predicted_data_frame)
                except Exception as e:
                    print(f"Error calculating monthly average: {e}")
                    continue

                for _, row in monthly_average.iterrows():
                    prediction_data = {
                        "Date": row["Month"],
                        "Product": description,
                        "Forecast": row["Average"],
                    }
                    all_predictions.append(pd.DataFrame([prediction_data]))
                await asyncio.sleep(0)  # Yield control

                progress_percentage = (index + 1) / total_descriptions * 100
                if progress_percentage <= 80:
                    yield {
                        "data": json.dumps(
                            {
                                "status": math.ceil(40 + (progress_percentage * 0.4)),
                                "message": f"Generating predictions for {description}... {progress_percentage:.2f}% complete",
                            }
                        )
                    }
                    await asyncio.sleep(0)
            yield {
                "data": json.dumps(
                    {"status": 90, "message": "Finalizing predictions..."}
                )
            }
            await asyncio.sleep(0)

            print(f"Stage:::: 5")
            try:
                final_predictions_df = pd.concat(all_predictions, ignore_index=True)
            except Exception as e:
                raise HTTPException(
                    detail="Insufficient data togenerate predictions", status_code=400
                )
            await asyncio.sleep(0)

            print(f"Stage:::: 6")
            file_name = file.file_name.split(".")[0]
            predictions_file_path = os.path.join(
                upload_folder, f"{file_name}_predictions.csv"
            )
            print(f"Stage:::: 7")
            final_predictions_df.to_csv(predictions_file_path, index=False)
            await asyncio.sleep(0)
            yield {
                "event": "end",
                "data": json.dumps(
                    {"status": 100, "message": "Prediction completed successfully."}
                ),
            }
        except Exception as e:
            error_message = str(e)
            yield {
                "event": "error",
                "data": json.dumps({"status": 0, "message": error_message}),
            }

    return EventSourceResponse(event_generator())


@forecasting.get("/downlaod_predictition_file/{file_id}")
def download_prediction(file_id: int, db: Session = Depends(get_db)):
    file = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    upload_folder = os.path.join(os.getcwd(), "uploads")
    file_name = file.file_name.split(".")[0]
    prediction_file = os.path.join(upload_folder, f"{file_name}_predictions.csv")
    return FileResponse(prediction_file, filename=f"{file_name}_prediction.csv")


@forecasting.get("/download_csv_file/{file_id}")
def download_prediction(file_id: int, db: Session = Depends(get_db)):
    file = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    upload_folder = os.path.join(os.getcwd(), "uploads")
    file_name = file.file_name.split(".")[0]
    csv_file = os.path.join(upload_folder, f"{file_name}.csv")
    return FileResponse(csv_file, filename=f"{file_name}.csv")


@forecasting.get("/get_product_data/{file_id}")
def get_product_data(file_id: int, db: Session = Depends(get_db)):
    """
    Get CSV data from a specific file.
    Parameters:
    - file_id (int): ID of the file.
    Returns:
    - data (List[Dict]): CSV data.
    """

    file = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    if file.file_path.endswith(".csv"):
        file_path = os.path.join(os.getcwd(), "uploads", file.file_name)
        df = pd.read_csv(file_path)
        df["Description"].fillna("", inplace=True)
        product_list = df["Description"].unique().tolist()

        return {
            "file": file.file_name,
            "number_of_products": len(product_list),
            "products": product_list,
        }
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")


@forecasting.get("/get_csv_data/{file_id}/{product_name}/{prediction_period}")
def get_csv_data(
    file_id: int,
    product_name: str,
    prediction_period: int,
    db: Session = Depends(get_db),
):
    """
    Get CSV data from a specific file.
    Parameters:
    - file_id (int): ID of the file.
    Returns:
    - data (List[Dict]): CSV data.
    """

    file = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    if file.file_path.endswith(".csv"):
        file_path = os.path.join(os.getcwd(), "uploads", file.file_name)
        df = pd.read_csv(file_path)
        product_data = df[df["Description"] == product_name]

        for column in product_data.columns:
            if pd.api.types.is_numeric_dtype(df[column]):
                product_data[column].fillna(0, inplace=True)
            else:
                product_data[column].fillna("", inplace=True)

        data = product_data.to_dict(orient="records")
        field_data = llama_chatbot(data[:5])["fields"]

        sort_col = field_data[0]
        if pd.api.types.is_numeric_dtype(product_data[sort_col]):
            product_data[sort_col] = pd.to_numeric(
                product_data[sort_col], errors="coerce"
            ).fillna(0)
        else:
            product_data[sort_col] = product_data[sort_col].astype(str)

        df_sorted = product_data.sort_values(by=sort_col)
        file_name = os.path.splitext(file.file_name)[0]

        description = "monthly_forecast"
        upload_folder = os.path.join(os.getcwd(), "uploads")
        predictions_file = os.path.join(
            upload_folder, f"{file_name}_{product_name}_{description}_predictions.csv"
        )

        try:
            data_frame = make_prediction(
                dataframe=df_sorted[field_data],
                fields=field_data,
                prediction_period=prediction_period)
            predicted_data = find_monthly_average(data_frame)
            predicted_data["Product"] = product_name
            if not os.path.exists(predictions_file):
                predicted_data.to_csv(predictions_file, index=False)
                print("Generating Embeddings..........")
                documents = load_csv_file(predictions_file)
                pg_vector.add_documents(documents)
            else:
                print(
                    f"File already exists: {predictions_file}. Skipping the saving and loading process."
                )
        except Exception as e:
            raise HTTPException(detail=f"{e}", status_code=400)
        to_return = {
            "fields": field_data,
            "csv_data": df_sorted[field_data].to_dict(orient="records"),
            "prediction_data": predicted_data.to_dict(orient="records"),
        }
        return to_return
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format")


@forecasting.post(
    "/upload_csv",
    summary="Upload a CSV file to create a new forecasting project")
def upload_csv(
    db: Session = Depends(get_db),
    csv_file: UploadFile = File(...),
    token: str = Depends(get_token),
):
    """
    Upload a CSV file to create a new forecasting project and generate embeddings.

    Parameters:
    - db (Session): Database session.
    - csv_file (UploadFile): The CSV file to be uploaded.
    - token (str): Authentication token.

    Returns:
    - Dict[str, str]: Contains the status of the upload and user_id.
    """
    try:

        active_user = db.query(Token).filter(Token.token == token).first()
        if not active_user:
            raise HTTPException(status_code=401, detail="Invalid token")
        if csv_file.content_type != "text/csv":
            raise HTTPException(status_code=400, detail="Only CSV files are allowed")

        WORKING_DIR = os.getcwd()
        upload_folder = os.path.join(WORKING_DIR, "uploads")
        os.makedirs(upload_folder, exist_ok=True)
        filename = f"{csv_file.filename}"
        uploaded_file_path = os.path.join(upload_folder, filename)

        # creating embeddings of csv file.
        file_content = csv_file.file.read()

        if not file_content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")
        csv_file.file.seek(0)

        # try:
        #     dataframe = pd.read_csv(csv_file.file)
        # except Exception as e:
        #     raise HTTPException(
        #         status_code=400, detail=f"Error reading CSV file: {str(e)}"
        #     )

        with open(uploaded_file_path, "wb") as buffer:
            buffer.write(file_content)

        # text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        # documents = CSVLoader(uploaded_file_path).load()

        # generate_csv_embeddings(uploaded_file_path)
        # # Split the documents and generate embeddings
        # for doc in text_splitter.split_documents(documents):
        #

        # try:

        #     future_data_frame = make_prediction(csv_file=uploaded_file_path)

        #     file_name = filename.split(".")[0]

        #     future_data_frame.to_csv(
        #         f"uploads/{file_name}_predictions.csv", index=False
        #     )

        # except Exception as e:
        #     raise HTTPException(
        #         status_code=500, detail=f"Error generating predictions: {str(e)}"
        #     )
        csv_file.file.close()
        new_file = FileModel(
            user_id=active_user.user_id,
            file_path=uploaded_file_path,
            file_name=csv_file.filename,
        )
        db.add(new_file)
        db.commit()
        db.refresh(new_file)
        return {
            "user_id": active_user.user_id,
            "file_data": {"file": new_file},
            "status": "Data Uploaded Successfully",
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


def generate_openAI_embeddings(api_key: str) -> OpenAIEmbeddings:
    """
    Initialize OpenAIEmbeddings with the provided API key.

    Parameters:
    - api_key (str): OpenAI API key.

    Returns:
    - OpenAIEmbeddings: Initialized embeddings object.
    """
    if not api_key:
        raise ValueError("OpenAI API key is missing.")

    embeddings = OpenAIEmbeddings(openai_api_key=api_key)
    return embeddings
