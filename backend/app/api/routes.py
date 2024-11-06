from fastapi import APIRouter, UploadFile, HTTPException, Depends
from sqlmodel import Session
from typing import List

from ..services.pdf_service import PDFService
from ..services.qa_service import QAService
from ..db.database import get_session
from ..models.document import DocumentCreate, DocumentRead
from ..models.question import QuestionCreate, QuestionRead

router = APIRouter()
pdf_service = PDFService()
qa_service = QAService()

@router.post("/documents/", response_model=DocumentRead)
async def upload_document(
    file: UploadFile,
    session: Session = Depends(get_session)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    return await pdf_service.process_document(file, session)

@router.get("/documents/", response_model=List[DocumentRead])
async def get_documents(session: Session = Depends(get_session)):
    return await pdf_service.get_all_documents(session)

@router.post("/documents/{document_id}/question", response_model=QuestionRead)
async def ask_question(
    document_id: str,
    question: QuestionCreate,
    session: Session = Depends(get_session)
):
    return await qa_service.process_question(document_id, question, session)