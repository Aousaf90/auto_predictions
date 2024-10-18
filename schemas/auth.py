from pydantic import BaseModel, Field, EmailStr


class Login(BaseModel):
    email: str =  Field()
    password: str =  Field()

class Register(BaseModel):
    email: str = Field()
    name: str =  Field()
    password: str =  Field()


class ResetPasswordPayload(BaseModel):
    email: str
    code: str

class ResetCodePayload(BaseModel):
    email: EmailStr
    code: str
    password: str

class SendResetCodePayload(BaseModel):
    email: EmailStr