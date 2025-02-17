import React from 'react';
import { ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DocumentHeaderProps {
  title: string;
  documentType: string;
  summary: string;
  documentUrl?: string;
  backText: string;
}

export default function DocumentHeader({ 
  title, 
  documentType, 
  summary, 
  documentUrl,
  backText 
}: DocumentHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {backText}
        </button>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          <span className="inline-flex items-center rounded-full bg-red-400/10 px-3 py-1 text-sm font-medium text-red-400">
            {documentType}
          </span>
        </div>
        <p className="mt-2 text-gray-400">{summary}</p>
      </div>
      {documentUrl && (
        <a 
          href={documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          View Document
        </a>
      )}
    </div>
  );
}