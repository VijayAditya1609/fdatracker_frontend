import React from 'react';
import { AlertTriangle, Building2, MapPin, Clock, FileText, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WarningLetterCardProps {
  warningLetter: {
    id: number;
    linked483Id: number | null;
    facilityName: string;
    companyName: string | null;
    location: string;
    issueDate: string;
    numOfViolations: number;
    status: boolean;
    systems: string[];
    productTypes: string[];
  };
  onClick: () => void;
}

export default function WarningLetterCard({ warningLetter, onClick }: WarningLetterCardProps) {
  const navigate = useNavigate();

  const formatSystemName = (system: string) => {
    return system.replace(/"/g, '');
  };

  const getViolationSeverityColor = (count: number) => {
    if (count >= 5) return 'bg-red-400/10 text-red-400';
    if (count >= 3) return 'bg-yellow-400/10 text-yellow-400';
    return 'bg-blue-400/10 text-blue-400';
  };

  return (
    <div
      className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer relative overflow-hidden"
      onClick={onClick}
    >
      {warningLetter.linked483Id && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/form-483s/${warningLetter.linked483Id}`);
            }}
            className="inline-flex items-center rounded-lg bg-blue-500 hover:bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors shadow-sm"
          >
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Form 483
            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </button>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="p-2 bg-gray-700 rounded-lg shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <div className="min-w-0 flex-1 pr-20">
            <h3 className="text-lg font-medium text-white break-words">
              {warningLetter.facilityName}
            </h3>
            {warningLetter.companyName && (
              <div className="flex items-center mt-1 text-sm text-gray-400">
                <Building2 className="h-4 w-4 mr-1 shrink-0" />
                <span className="break-words">{warningLetter.companyName}</span>
              </div>
            )}
            <div className="mt-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap
                ${getViolationSeverityColor(warningLetter.numOfViolations)}`}>
                {warningLetter.numOfViolations} {warningLetter.numOfViolations === 1 ? 'Violation' : 'Violations'}
              </span>
            </div>
          </div>
        </div>

        {/* Systems */}
        {warningLetter.systems && warningLetter.systems.length > 0 && warningLetter.systems[0] !== "NULL" && (
          <div className="mt-6">
            <span className="text-sm text-gray-400">Systems Cited</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {warningLetter.systems
                .filter(system => system !== "NULL")
                .map((system, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400"
                  >
                    {formatSystemName(system)}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Product Types */}
        {warningLetter.productTypes && warningLetter.productTypes.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-gray-400">Product Types</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {warningLetter.productTypes.map((type, index) => {
                const cleanType = type.replace(/[\[\]"\\]/g, '');
                return (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-purple-400/10 px-2 py-1 text-xs font-medium text-purple-400"
                  >
                    {cleanType}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-400">
            <MapPin className="h-4 w-4 mr-1" />
            {warningLetter.location}
          </div>
          <div className="flex items-center text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            {new Date(warningLetter.issueDate).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}