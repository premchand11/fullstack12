from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class DocumentBase(SQLModel):
    name: str
    content: str
    upload_date: datetime = Field(default_factory=datetime.utcnow)

class Document(DocumentBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    file_path: str

class DocumentCreate(DocumentBase):
    pass

class DocumentRead(DocumentBase):
    id: int