import React from 'react';
import { Clock, Building2, FileWarning, AlertTriangle, ExternalLink } from 'lucide-react';
import { Form483AndWL } from '../../../services/facility';
import { useNavigate } from 'react-router-dom';

interface DocumentsListProps {
  documents: Form483AndWL;
}

export default function DocumentsList({ documents }: DocumentsListProps) {
  const navigate = useNavigate();
  const hasDocuments = documents.facilitiesInspectionsList483.length > 0 || 
                      documents.facilitiesInspectionsListWl.length > 0;

  return (
    <div className="space-y-8">
      {/* Form 483s Section */}
      {documents.facilitiesInspectionsList483.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FileWarning className="h-5 w-5 mr-2 text-blue-500" />
            Form 483s
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.facilitiesInspectionsList483.map((doc, index) => (
              <div
                key={index}
                onClick={() => navigate(`/form-483s/${doc.pdf_id}`)}
                className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-lg 
                  hover:bg-gray-700 transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className="flex flex-col gap-4">
                  <h4 className="text-lg font-semibold text-white">{doc.company_affected}</h4>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    {new Date(doc.issue_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                    {doc.feinumber}
                  </div>
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-400 transition-colors text-sm font-medium flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Document
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  )}
                  <span className="inline-block rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-sm w-auto max-w-max">
                    {doc.producttype}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning Letters Section */}
      {documents.facilitiesInspectionsListWl.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
            Warning Letters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.facilitiesInspectionsListWl.map((doc, index) => (
              <div
                key={index}
                onClick={() => navigate(`/warning-letters/${doc.id}`)}
                className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-lg 
                  hover:bg-gray-700 transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className="flex flex-col gap-4">
                  <h4 className="text-lg font-semibold text-white">{doc.company_affected}</h4>
                  <div className="flex items-center text-sm text-gray-400">
                    <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                    {doc.feinumber2}
                  </div>
                  {doc.letter_url && (
                    <a
                      href={doc.letter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-500 hover:text-yellow-400 transition-colors text-sm font-medium flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Warning Letter
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  )}
                  <span className="inline-block rounded-full bg-gradient-to-r from-yellow-500 to-red-500 px-4 py-2 text-xs font-semibold text-white shadow-sm w-auto max-w-max">
                    {doc.producttype}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Documents Message */}
      {!hasDocuments && (
        <div className="text-center text-gray-400">
          No documents available.
        </div>
      )}
    </div>
  );
}
