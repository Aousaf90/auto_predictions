from sqlalchemy import Column, DateTime, ForeignKey, String, Integer, Boolean
from sqlalchemy.orm import relationship
from database import Base, engine
from datetime import datetime


class User(Base):
    __tablename__ = 'users'    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    email_verified = Column(Boolean, nullable=False)
    password_hash = Column(String, nullable=False)
    codes = relationship('Code', back_populates='user', cascade="all, delete-orphan")
    files = relationship('File', back_populates='user', cascade="all, delete-orphan")  # Changed from 'file' to 'files'

class Token(Base):
    __tablename__ = 'tokens'
    id = Column(Integer, primary_key=True, autoincrement=True, index=True)  # Set autoincrement=True
    user_id = Column(Integer, ForeignKey('users.id'), index=True)  # Make sure to refer to the user_id correctly
    token = Column(String, unique=True, nullable=False)

class Code(Base):
    __tablename__ = 'codes'
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)
    value = Column(String, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    user = relationship('User', back_populates='codes')

class File(Base):
    __tablename__ = 'files'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String, nullable=False)
    user = relationship('User', back_populates='files')

class Chats(Base):
    __tablename__ = 'chats'
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    send_message = Column(String, nullable=True)
    receive_message = Column(String, nullable=True)
    datetime = Column(DateTime, nullable=True)
Base.metadata.create_all(bind=engine)
