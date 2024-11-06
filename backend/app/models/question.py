from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class QuestionBase(SQLModel):
    content: str
    document_id: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Question(QuestionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    answer: str

class QuestionCreate(SQLModel):
    content: str

class QuestionRead(QuestionBase):
    id: int
    answer: str