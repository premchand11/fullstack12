import { Document, Message } from '../types';

const API_URL = 'http://localhost:8000/api';

export async function uploadDocument(file: File): Promise<Document> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/documents/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload document');
  }

  const data = await response.json();
  return {
    id: data.id.toString(),
    name: data.name,
    uploadDate: data.upload_date,
    size: file.size,
  };
}

export async function getDocuments(): Promise<Document[]> {
  const response = await fetch(`${API_URL}/documents/`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }

  const data = await response.json();
  return data.map((doc: any) => ({
    id: doc.id.toString(),
    name: doc.name,
    uploadDate: doc.upload_date,
    size: 0, // Size not provided by backend
  }));
}

export async function askQuestion(documentId: string, content: string): Promise<Message> {
  const response = await fetch(`${API_URL}/documents/${documentId}/question`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error('Failed to get answer');
  }

  const data = await response.json();
  return {
    id: data.id.toString(),
    type: 'assistant',
    content: data.answer,
    timestamp: data.timestamp,
  };
}