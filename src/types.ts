export interface Document {
  id: string;
  name: string;
  uploadDate: string;
  size: number;
}

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  documentId: string;
  messages: Message[];
}