from pydantic import BaseModel, Field

class ChatQuestion(BaseModel):
    question: str = Field()