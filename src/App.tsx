import React, { useState, useEffect } from 'react';
import { DocumentUpload } from './components/DocumentUpload';
import { DocumentList } from './components/DocumentList';
import { Chat } from './components/Chat';
import { Document, Message, Conversation } from './types';
import { FileQuestion } from 'lucide-react';
import * as api from './api/client';

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string | undefined>();
  const [conversations, setConversations] = useState<Record<string, Conversation>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const docs = await api.getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const newDoc = await api.uploadDocument(file);
      setDocuments(prev => [...prev, newDoc]);
    } catch (error) {
      console.error('Failed to upload document:', error);
      // TODO: Show error toast
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedDoc) return;

    const messageId = Date.now().toString();
    const userMessage: Message = {
      id: messageId,
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    // Update conversation immediately with user message
    setConversations(prev => ({
      ...prev,
      [selectedDoc]: {
        id: selectedDoc,
        documentId: selectedDoc,
        messages: [...(prev[selectedDoc]?.messages || []), userMessage]
      }
    }));

    setIsLoading(true);

    try {
      const assistantMessage = await api.askQuestion(selectedDoc, content);

      setConversations(prev => ({
        ...prev,
        [selectedDoc]: {
          id: selectedDoc,
          documentId: selectedDoc,
          messages: [...(prev[selectedDoc]?.messages || []), assistantMessage]
        }
      }));
    } catch (error) {
      console.error('Failed to get answer:', error);
      // TODO: Show error toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <FileQuestion className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">PDF Q&A Assistant</h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <DocumentUpload onUpload={handleUpload} />
            
            {documents.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Documents</h2>
                <DocumentList
                  documents={documents}
                  selectedId={selectedDoc}
                  onSelect={setSelectedDoc}
                />
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            {selectedDoc ? (
              <div className="bg-white rounded-lg shadow-sm border h-[600px]">
                <Chat
                  messages={conversations[selectedDoc]?.messages || []}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <FileQuestion className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a document to start
                </h3>
                <p className="text-gray-500">
                  Choose a document from the list to begin asking questions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;