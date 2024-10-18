from langchain_community.document_loaders.csv_loader import CSVLoader
from langchain_postgres import PGVector
import os 
from dotenv import load_dotenv
load_dotenv()
from langchain_google_genai import GoogleGenerativeAIEmbeddings


DATABASE_URL = os.getenv('DATABASE_URL')
def load_csv_file(path):
    loader = CSVLoader(path)
    splited_csv = loader.load_and_split()
    return splited_csv

embeddings = GoogleGenerativeAIEmbeddings(google_api_key='AIzaSyDb8x0zZsSs-bGcRM1AnXI4YxwwQ6dnfTQ', model="models/text-embedding-004")
pg_vector = PGVector(
    embeddings=embeddings,
    # collection_name="Test Embeddings",
    connection=DATABASE_URL,
    use_jsonb=True
)

def main():
    csv_path = "wholesaler.csv"
    documents = load_csv_file(csv_path)
    pg_vector.add_documents(documents)
    query = "French Bros company"
    search_results = pg_vector.similarity_search(query=query, k=2)
    print("Search Result", search_results)

if _name_ == "_main_":
    main()