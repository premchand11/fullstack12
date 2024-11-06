from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from sqlmodel import Session
from typing import Optional

from ..models.question import Question, QuestionCreate
from ..models.document import Document
from ..core.config import get_settings

settings = get_settings()

class QAService:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-3.5-turbo",
            temperature=0,
            api_key=settings.OPENAI_API_KEY
        )
        
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful assistant that answers questions based on the provided document content. "
                      "Answer questions truthfully using the provided content. "
                      "If you cannot answer a question based on the content, say so."),
            ("user", "Document content: {content}\n\nQuestion: {question}")
        ])
        
        self.chain = self.prompt | self.llm | StrOutputParser()
    
    async def process_question(
        self,
        document_id: int,
        question: QuestionCreate,
        session: Session
    ) -> Question:
        # Get document
        document = session.get(Document, document_id)
        if not document:
            raise ValueError(f"Document with id {document_id} not found")
        
        # Generate answer using LangChain
        answer = await self.chain.ainvoke({
            "content": document.content,
            "question": question.content
        })
        
        # Create question record
        db_question = Question(
            content=question.content,
            document_id=document_id,
            answer=answer
        )
        
        session.add(db_question)
        session.commit()
        session.refresh(db_question)
        
        return db_question