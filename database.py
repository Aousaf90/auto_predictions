from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, ForeignKey, String, Integer, Text, LargeBinary
from sqlalchemy.orm import relationship
import os
import dotenv
dotenv.load_dotenv()

DATABASE_URL = f"postgresql://postgres:qiSiUWIDNDbFKoTFFZZjboBMOkGnvKBK@focastiq-app.chayuukw8bkk.eu-north-1.rds.amazonaws.com:5432/focastIQ_db"
# DATABASE_URL = f"postgresql://postgres:123456789@localhost:5432/dataForcasting"
engine = create_engine(url=DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()
def get_db():
    """
    Dependency that provides a database session. Yields a database session object
    and ensures that the session is closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# class User(Base):
#     __tablename__ = 'users'
#     id = Column(Integer, primary_key=True, index=True)
#     name = Column(String, nullable=False)
#     email = Column(String, unique=True, nullable=False)
#     email_varified =  Column(String, nullable=False)
#     password_hash = Column(LargeBinary, nullable=False)

