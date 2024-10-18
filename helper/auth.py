from fastapi import Depends, HTTPException, status
from typing import Literal, Union, Tuple, Annotated
from .email_send import send_email
from sqlalchemy.orm import Session
import random
from passlib.context import CryptContext
from models.auth import User, Code, Token
from datetime import datetime, timedelta
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
import dotenv
import jwt
from database import get_db

dotenv.load_dotenv()
security = HTTPBearer()
JWT_SECRET = os.getenv("JWT_SECRET")
SECRET_KEY = "abcdefghijklmnopqrstuvwxyz"
ALROGITHM = "HS256"

pwd_context = CryptContext(schemes=["argon2", "bcrypt"])

def hash_password(password: str) -> str:
    """
    Hash a plain text password.
    Args:
        password (str): The plain text password.
    Returns:
        str: The hashed password.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against its hash.
    Args:
        plain_password (str): The plain text password.
        hashed_password (str): The hashed password.
    Returns:
        bool: True if the password matches, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)

def generate_token(user:User):
    """
    Generate a JWT token for the given user, including their ID, email, and expiration time
    in the payload.
    """
    payload = {"id": user.id, "email": user.email, "exp": datetime.now()}
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALROGITHM)
    return token


async def get_current_user(credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)], db: Session = Depends(get_db)) -> User:
    """
    Fetch the current user based on the JWT token provided in the Authorization header.
    
    Args:
        credentials (HTTPAuthorizationCredentials): The token provided via HTTPBearer.
        db (Session): The database session.
    
    Returns:
        User: The authenticated user instance.
    
    Raises:
        HTTPException: If the token is invalid, expired, or the user does not exist.
    """
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("id")
        if user_id is None:
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise credentials_exception
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.email_confirmed:
        raise credentials_exception

    return user


async def generate_code(type: Literal["password_reset", "account_activation"], user: User, db: Session) -> Tuple[Code, bool]:
    """
    Generates a code for account actions and sends the corresponding email.

    Args:
        type (Literal["password_reset", "account_activation"]): The type of code to generate.
        user (User): The user for whom the code is generated.
        db (Session): The database session.

    Returns:
        Tuple[Code, bool]: The created Code instance and a boolean indicating if the email was sent successfully.
    """
    try:
        code_value = str(random.randint(1000, 9999))
        code = Code(
            type=type,
            value=code_value,
            expires_at=datetime.utcnow() + timedelta(minutes=40),
            user_id=user.id
        )
        db.add(code)
        db.commit()

        if type == "password_reset":
            email_sent = send_reset_email(user.email, code_value)
        elif type == "account_activation":
            email_sent = send_confirmation_email(user.email, code_value)
        else:
            raise ValueError("Invalid code type provided.")

        return code, email_sent
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to generate code: {e}")


def send_reset_email(to_email: str, code: Union[str, int]) -> bool:
    """
    Send a password reset email to the user.

    Args:
        to_email (str): The recipient email.
        code (Union[str, int]): The reset code.

    Returns:
        bool: True if the email was sent successfully, False otherwise.
    """
    message_html = f"""
    <html>
      <head></head>
      <body>
        <p>Hi,<br>
           Here is your password reset code: <b>{code}</b><br>
           Please use this code to reset your password.
        </p>
      </body>
    </html>
    """
    return send_email(to_email, "Confirm Email to Reset Password", message_html)


def send_confirmation_email(to_email: str, code: Union[str, int]) -> bool:
    """
    Send an account activation email to the user.

    Args:
        to_email (str): The recipient email.
        code (Union[str, int]): The activation code.

    Returns:
        bool: True if the email was sent successfully, False otherwise.
    """
    message_html = f"""
    <html>
      <head></head>
      <body>
        <p>Hi,<br>
           Here is your account activation code: <b>{code}</b><br>
           Please use this code to activate your account.
        </p>
      </body>
    </html>
    """
    return send_email(to_email, "Confirm Email to Activate Account", message_html)
