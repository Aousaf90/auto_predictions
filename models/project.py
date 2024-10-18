from sqlalchemy import Column, DateTime, ForeignKey, String, Integer, Boolean
from sqlalchemy.orm import relationship
from .auth import User
from database import Base, engine
from datetime import datetime




Base.metadata.create_all(bind=engine)
