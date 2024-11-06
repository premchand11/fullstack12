import os
from fastapi import UploadFile, HTTPException
from sqlmodel import Session
from typing import List
import pypdf
from ..models.document import Document, DocumentCreate
from ..core.config import get_settings

settings = get_settings()

class PDFService:
    async def process_document(self, file: UploadFile, session: Session) -> Document:
        # Create documents directory if it doesn't exist
        os.makedirs(settings.DOCUMENTS_PATH, exist_ok=True)
        
        file_path = os.path.join(settings.DOCUMENTS_PATH, file.filename)
        
        try:
            # Save the uploaded file
            content = await file.read()
            with open(file_path, "wb") as f:
                f.write(content)
            
            # Extract text from PDF
            pdf_text = self._extract_text_from_pdf(file_path)
            
            # Create document record
            document = Document(
                name=file.filename,
                content=pdf_text,
                file_path=file_path
            )
            
            session.add(document)
            session.commit()
            session.refresh(document)
            
            return document
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    async def get_all_documents(self, session: Session) -> List[Document]:
        return session.query(Document).all()
    
    def _extract_text_from_pdf(self, file_path: str) -> str:
        text = ""
        with open(file_path, "rb") as file:
            pdf = pypdf.PdfReader(file)
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        return text