# PDF Q&A Application

A full-stack application that allows users to upload PDF documents and ask questions about their content using AI.

## Features

- PDF document upload and management
- Natural language question answering about PDF content
- Real-time chat interface
- Markdown support for responses
- Beautiful, responsive UI

## Setup

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file with your OpenAI API key:
```
OPENAI_API_KEY=your-openai-api-key-here
DATABASE_URL=sqlite:///./pdf_qa.db
DOCUMENTS_PATH=./documents
```

5. Initialize the database:
```python
python -c "from app.db.database import init_db; init_db()"
```

6. Start the server:
```bash
uvicorn main:app --reload
```

## Usage

1. Open the application in your browser (default: http://localhost:5173)
2. Upload a PDF document using the upload area
3. Select the document from the list
4. Start asking questions about the document content
5. View AI-generated responses in real-time

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS, Vite
- Backend: FastAPI, LangChain, SQLModel
- Database: SQLite
- AI: OpenAI GPT-3.5