# from langchain_groq import ChatGroq
# from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
# prompt = ChatPromptTemplate.from_messages([
#     MessagesPlaceholder("history"),
#     ("user", "{question}")
# ])

# model = ChatGroq(
#     model="llama3-8b-8192",
#     temperature=0,
#     max_tokens=None,
#     timeout=None,
#     max_retries=2,
#     api_key="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"
# )

# output_parser = StrOutputParser()

# chain = prompt | model | output_parser

# history = []
# while True:
#     question = input("\n>> ")
#     answer = ""

#     if question.strip().lower() == "quit": break

#     stream = chain.stream({
#         "history": history, 
#         "question": question
#     })
#     for chunk in stream:
#         print(chunk, end="", flush=True)
#         answer += chunk

#     history.append(("user", question))
#     history.append(("system", answer))


#____________________________________________________________________
# from langchain_community.utilities import SQLDatabase
# from langchain_community.agent_toolkits import create_sql_agent
# from sqlalchemy import create_engine
# from langchain_groq import ChatGroq
# import pandas as pd

# DATABASE_URL = f"postgresql://postgres:123456789@localhost:5432/dataForcasting"
# engine = create_engine(url=DATABASE_URL)
# dataframe =  pd.read_csv("uploads/2017PurchasePricesDec.csv")
# dataframe.to_sql("2017PurchasePricesDec", engine, index=False)
# llm = ChatGroq(
#     model="llama3-8b-8192",
#     temperature=0,
#     max_tokens=None,
#     timeout=None,
#     max_retries=2,
#     api_key="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"
# )
# db = SQLDatabase(engine=engine)
# print(f"db.dialect: {db.dialect}")
# print(f"db.get_usable_table_names(): {db.get_usable_table_names()}")
# agent_executor = create_sql_agent(llm, db=db, agent_type="openai-tools", verbose=True)
# result = agent_executor.invoke({"input": "How many products are there? "})
# print(f"Result: {result}")
#_______________________________________________________________


from langchain.document_loaders import CSVLoader
import pandas as pd
import groq
from langchain_postgres import PGVector
from langchain.embeddings import LlamaCppEmbeddings


dataframe =  pd.read_csv("uploads/2017PurchasePricesDec.csv")
full_text = ' '.join(dataframe.apply(lambda row: ' '.join([str(item) for item in row]), axis=1))
groq_client = groq.Client(api_key="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")
embeddings = groq_client.infer(model="llama3-8b-8192", data="uploads/2017PurchasePricesDec.csv")
print(f"Embeddings: {embeddings}")

doc = CSVLoader("uploads/2017PurchasePricesDec.csv").load()
PGVector.from_documents(
    documents=doc,
    embedding=embeddings,
    connection="postgresql://postgres:123456789@localhost:5432/dataForcasting"
)