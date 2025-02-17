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
          <div className="space-y-4">
            {documents.facilitiesInspectionsList483.map((doc, index) => (
              <div
                key={index}
                onClick={() => navigate(`/form-483s/${doc.pdf_id}`)}
                className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-md 
                  hover:bg-gray-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{doc.company_affected}</h4>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        {new Date(doc.issue_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                        {doc.feinumber}
                      </div>
                    </div>
                  </div>
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 md:mt-0 text-blue-500 hover:text-blue-400 transition-colors text-sm font-medium flex items-center"
                      onClick={(e) => e.stopPropagation()} // Prevent card click when clicking the link
                    >
                      View Document
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  )}
                </div>
                <div className="mt-4">
                  <span className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
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
          <div className="space-y-4">
            {documents.facilitiesInspectionsListWl.map((doc, index) => (
              <div
                key={index}
                onClick={() => navigate(`/warning-letters/${doc.id}`)}
                className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-md 
                  hover:bg-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{doc.company_affected}</h4>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                        {doc.feinumber2}
                      </div>
                    </div>
                  </div>
                  {doc.letter_url && (
                    <a
                      href={doc.letter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 md:mt-0 text-yellow-500 hover:text-yellow-400 transition-colors text-sm font-medium flex items-center"
                      onClick={(e) => e.stopPropagation()} // Prevent card click when clicking the link
                    >
                      View Warning Letter
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </a>
                  )}
                </div>
                <div className="mt-4">
                  <span className="inline-block rounded-full bg-gradient-to-r from-yellow-500 to-red-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
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
