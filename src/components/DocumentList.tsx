import React from 'react';
import { FileText, Clock } from 'lucide-react';
import { Document } from '../types';

interface DocumentListProps {
  documents: Document[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function DocumentList({ documents, selectedId, onSelect }: DocumentListProps) {
  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <button
          key={doc.id}
          onClick={() => onSelect(doc.id)}
          className={`w-full p-4 rounded-lg text-left transition-colors ${
            selectedId === doc.id
              ? 'bg-blue-50 border-blue-200'
              : 'hover:bg-gray-50 border-transparent'
          } border`}
        >
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-gray-400 mt-1" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{doc.name}</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                <span>·</span>
                <span>{formatFileSize(doc.size)}</span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}