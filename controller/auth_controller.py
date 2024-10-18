from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from helper.auth import hash_password, verify_password, generate_code, generate_token
from database import get_db, Session
from models.auth import User, Code, Token
from schemas.auth import (
    Login,
    Register,
    SendResetCodePayload,
    ResetPasswordPayload,
    ResetCodePayload,
)

auth = APIRouter()


@auth.post("/login")
def login(login_cred: Login, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == login_cred.email).first()
        if not user:
            print(f"User: {user}")
            raise HTTPException(status_code=401, detail="Email not registered")
        print(f"Password before hashed: {login_cred.password}")
        print(f"Password: {hash_password(user.password_hash)}")
        if not verify_password(login_cred.password, user.password_hash):
            print(f"Password: {User.password_hash}")
            raise HTTPException(status_code=401, detail="Incorrect password")
        if not user.email_verified:
            raise HTTPException(status_code=401, detail="Email not verified")
        access_token = generate_token(user)
        token = Token(
            user_id=user.id,
            token=access_token,
        )
        db.add(token)
        db.commit()
        db.refresh(token)
        return {
            "email": user.email,
            "user_name": user.name,
            "access_token": access_token,
            "token_type": "bearer",
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=401, detail=f"{e}")


@auth.post("/register")
async def register(register_cred: Register, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == register_cred.email).first()
        if user:
            raise HTTPException(status_code=400, detail="Email already registered.")
        hashed_password = hash_password(register_cred.password)
        user = User(
            email=register_cred.email,
            password_hash=hashed_password,
            name=register_cred.name,
            email_verified=False,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        try:
            code_instance, is_email_sent = await generate_code(
                "account_activation", user, db
            )
            db.add(code_instance)
            db.commit()
            db.refresh(code_instance)

            print(f"Code Data: {code_instance}")
            print(f"Email Sent: {is_email_sent}")

            return {"message": "Verification Email sent successfully."}
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=500, detail=f"Error generating activation code: {e}"
            )
    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {e}")


@auth.post("/reset-password")
async def reset_password(data: ResetCodePayload, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == data.email).first()
        if not user:
            raise HTTPException(
                status_code=400, detail="User with this email does not exist."
            )
        code_entry = (
            db.query(Code)
            .filter(
                Code.user_id == user.id,
                Code.value == data.code,
                Code.type == "password_reset",
            )
            .first()
        )

        if not code_entry:
            raise HTTPException(status_code=400, detail="Invalid reset code provided.")
        print(f"Password: {data.password}")
        user.password_hash = hash_password(data.password)
        db.commit()
        db.refresh(user)
        return {"success": True, "detail": "Password reset successfully."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error resetting password: {e}")


@auth.post("/send-reset-code")
async def send_reset_code(data: SendResetCodePayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="You are not registered.")

    try:
        await generate_code("password_reset", user, db)
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=500, detail="Failed to send password reset code."
        )
    return {"success": True, "detail": "Password Reset Code sent successfully."}


@auth.post("/account_activation")
def account_activatoin(data: ResetPasswordPayload, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == data.email).first()
        if not user:
            raise HTTPException(status_code=400, detail="User not found")
        validate = (
            db.query(Code)
            .filter(
                Code.value == data.code,
                Code.type == "account_activation",
                Code.user_id == user.id,
            )
            .first()
        )
        user.email_verified = True
        db.commit()
        if validate:
            return {"success": True, "detail": "Email Verified...."}
        else:
            raise HTTPException(status_code=400, detail="Invalid Code")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"{e}")
