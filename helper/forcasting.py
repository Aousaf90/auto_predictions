from fastapi import APIRouter, Depends
from langchain_community.document_loaders import (
    TextLoader,
    UnstructuredMarkdownLoader,
    UnstructuredExcelLoader,
    Docx2txtLoader,
    PyPDFLoader,
    CSVLoader
)
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_postgres import PGVector
import os
import pandas as pd
from prophet import Prophet
from langchain_text_splitters import CharacterTextSplitter
from database import DATABASE_URL
import uuid


embeddings = HuggingFaceEmbeddings(model_name='all-MiniLM-L6-v2')
pg_vector = PGVector(
    embeddings=embeddings,
    connection=DATABASE_URL,
    use_jsonb=True,
)


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


def get_groq_respons(question: str, search_reesult: list):
    prompt = ChatPromptTemplate.from_messages([
        ("user", "Based on the following prediction data:\n{search_reesult}\n\nAnswer the question briefly: {question}")
    ])
    model = ChatGroq(
        model="llama3-8b-8192",
        temperature=0,
        max_tokens=8000,
        timeout=None,
        max_retries=2,
        api_key="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"
    )

    output_parser = StrOutputParser()
    chain = prompt | model | output_parser

    stream = chain.stream({
        "search_reesult": search_reesult,
        "question": question,
    })
    answer = ""
    for chunk in stream:
        
        answer += chunk
        yield chunk

def delete_file(file_name):
    upload_folder = os.path.join( os.getcwd(), "uploads")
    file_path = os.path.join(upload_folder, file_name)
    if os.path.isfile(file_path):
        os.remove(file_path)

def generate_csv_embeddings(csv_file):
    documents = load_csv_file(csv_file)
    
    pg_vector.add_documents(documents)



def document_split(document):
    """
    Split the content of a document into chunks.
    Args:
        document: The document to split.
    Returns:
        A list of document chunks.
    """
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    for doc in text_splitter.split_documents(document):
        yield doc


def load_csv_file(path):
    loader = CSVLoader(path).load()
    # splited_csv = loader.load_and_split()
    return loader


def load_document(path: str, extension: str):
    """
    Load a document based on its file extension.
    Args:
        path: Path to the document file.
        extension: File extension of the document.
        metadata: Additional metadata associated with the document.
    Returns:
        The loaded document or None if an error occurs.
    """
    try:
        if extension == "txt":
            document = TextLoader(path, encoding="utf-8").load()
        elif extension == "md":
            document = UnstructuredMarkdownLoader(path).load()
        elif extension == "xlsx":
            document = UnstructuredExcelLoader(path, mode="elements").load()
        elif extension == "xls":
            document = UnstructuredExcelLoader(path, mode="elements").load()
        elif extension == "docx":
            document = Docx2txtLoader(path).load()
        elif extension == "pdf":
            document = PyPDFLoader(path).load()
        elif extension == "csv":
            document = CSVLoader(path).load()
        else:
            document = TextLoader(path, encoding="utf-8").load()
    except UnicodeDecodeError as e:

        document = None
    except Exception as e:
        document = None
    return document


def llama_chatbot(csv_data: list ):
    json_format = """
        {
             'fields': ['date_field', 'other_field',...]
        }
        """
    formatted_data = "\n".join([str(item) for item in csv_data])
    prompt = ChatPromptTemplate.from_messages([
        ("user", """Given the provided CSV data, please identify and list
         2 potential fields that can be utilized to represent values on a graph.
         The value should be of numaric type and it can also be used for prediction through prophet library.
         Mostly for prediction we use one value for datetime and other something else.
        Note: One of the fields should be date
         CSV Data:
         {formatted_data}

         return only fields name no extra words
         return in JSON format:
         {json_format}
         """)
    ])
    model = ChatGroq(
        model="llama3-8b-8192",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        api_key="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"
    )
    output_parser = JsonOutputParser()
    chain = prompt | model | output_parser
    stream = chain.invoke({
        "formatted_data": formatted_data,
        "json_format":json_format
    })
    
    return stream


def find_monthly_average(csv_path):
    df = pd.read_csv(csv_path)
    df['ds'] = pd.to_datetime(df['ds'])
    df['Month'] = df['ds'].dt.strftime('%m-%Y')
    monthly_avg = df.groupby('Month')['yhat'].mean().reset_index()
    monthly_avg.columns = ['Month', 'Average']
    return monthly_avg



def make_prediction(dataframe, fields, prediction_period):
    try:
        rename_dict = {fields[1]: 'y', fields[0]: 'ds'}        
        missing_cols = [col for col in rename_dict.keys() if col not in dataframe.columns]
        if missing_cols:
            raise ValueError(f"Columns to rename not found in dataframe: {missing_cols}")

        dataframe.rename(columns=rename_dict, inplace=True)


        dataframe['ds'] = pd.to_datetime(dataframe['ds'], errors='coerce')

        num_na_ds = dataframe['ds'].isna().sum()
        num_na_y = dataframe['y'].isna().sum()
        dataframe = dataframe.dropna(subset=['ds', 'y'])

        if dataframe.empty:
            raise ValueError("Dataframe is empty after dropping NaN values. Cannot fit Prophet model.")
        m = Prophet()
        m.fit(dataframe)

        future = m.make_future_dataframe(periods=prediction_period, freq='M')
        forecast = m.predict(future)
        future_forecast = forecast[forecast['ds'] > dataframe['ds'].max()]
        return future_forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
    except FileNotFoundError:
        pass
        # 
    except pd.errors.EmptyDataError:
        print("Error: pd.errors.EmptyDataError")
    except pd.errors.ParserError:
        print("Error: pd.errors.EmptyDataError")
        
    except Exception as e:
        print("Error: pd.errors.EmptyDataError")
        

        
# def make_prediction(dataframe, fields):
#     try:
#         # Step 1: Read CSV
#         # dataframe = pd.read_csv(csv_file)
#         
#         

#         # Step 2: Process with llama_chatbot
#         # fields = llama_chatbot(dataframe.to_dict(orient="records")[:5])
#         # 

#         # # Validate the structure of fields
#         # if 'fields' not in fields or len(fields['fields']) < 2:
#         #     raise ValueError("llama_chatbot did not return sufficient field names.")

#         # Step 3: Rename Columns
#         rename_dict = {fields['fields'][1]: 'y', fields['fields'][0]: 'ds'}
#         
#         missing_cols = [col for col in rename_dict.keys() if col not in dataframe.columns]
#         if missing_cols:
#             raise ValueError(f"Columns to rename not found in dataframe: {missing_cols}")

#         dataframe.rename(columns=rename_dict, inplace=True)
#         
#         

#         dataframe['ds'] = pd.to_datetime(dataframe['ds'], errors='coerce')
#         
#         

#         # Step 5: Check for NaNs in 'ds' and 'y'
#         num_na_ds = dataframe['ds'].isna().sum()
#         num_na_y = dataframe['y'].isna().sum()
#         
#         

#         # Warn about missing values
#         if num_na_ds > 0:
#             
#         if num_na_y > 0:
#             

#         # Step 6: Drop rows with NaNs in 'ds' or 'y'
#         dataframe = dataframe.dropna(subset=['ds', 'y'])
#         
#         
#         

#         if dataframe.empty:
#             raise ValueError("Dataframe is empty after dropping NaN values. Cannot fit Prophet model.")

#         # Step 7: Initialize and Fit Prophet
#         m = Prophet()
#         m.fit(dataframe)
#         

#         # Step 8: Create Future Dataframe and Predict
#         future = m.make_future_dataframe(periods=180, freq='D')
#         forecast = m.predict(future)
#         

#         return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]

#     except FileNotFoundError:
#         
#     except pd.errors.EmptyDataError:
#         
#     except pd.errors.ParserError:
#         
#     except Exception as e:
#         