import React from 'react';
import { FileText, Building2, MapPin, Clock, AlertTriangle,ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Form483CardProps {
  form483: {
    id: number;
    facilityName: string;
    companyName: string | null;
    location: string;
    issueDate: string;
    numOfObservations: number;
    status: boolean;
    systems: string[];
    wlId?: number;
  };
  onClick: () => void;
}

export default function Form483Card({ form483, onClick }: Form483CardProps) {
  const navigate = useNavigate();

  const formatSystemName = (system: string) => {
    return system.replace(/"/g, '');
  };

  const getObservationSeverityColor = (count: number) => {
    if (count >= 8) return 'bg-red-400/10 text-red-400';
    if (count >= 4) return 'bg-yellow-400/10 text-yellow-400';
    return 'bg-blue-400/10 text-blue-400';
  };

  return (
    <div
      className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer relative overflow-hidden"
      onClick={onClick}
    >
      {form483.wlId && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/warning-letters/${form483.wlId}`);
            }}
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 px-3 py-1.5 text-xs font-medium text-gray-900 transition-colors shadow-sm"
          >
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
            WL
            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </button>
        </div>
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="p-2 bg-gray-700 rounded-lg shrink-0">
            <FileText className="h-6 w-6 text-blue-400" />
          </div>
          <div className="min-w-0 flex-1 pr-20">
            <h3 className="text-lg font-medium text-white break-words">
              {form483.facilityName}
            </h3>
            {form483.companyName && (
              <div className="flex items-center mt-1 text-sm text-gray-400">
                <Building2 className="h-4 w-4 mr-1 shrink-0" />
                <span className="break-words">{form483.companyName}</span>
              </div>
            )}
            <div className="mt-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap
                ${getObservationSeverityColor(form483.numOfObservations)}`}>
                {form483.numOfObservations} {form483.numOfObservations === 1 ? 'Observation' : 'Observations'}
              </span>
            </div>
          </div>
        </div>

        {/* Systems */}
        {form483.systems && form483.systems.length > 0 && form483.systems[0] !== "NULL" && (
          <div className="mt-6">
            <span className="text-sm text-gray-400">Systems Cited</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {form483.systems
                .filter(system => system !== "NULL")
                .map((system, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-blue-400/10 px-2.5 py-1 text-xs font-medium text-blue-400"
                  >
                    {formatSystemName(system)}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-400">
            <MapPin className="h-4 w-4 mr-1 shrink-0" />
            <span className="truncate">{form483.location}</span>
          </div>
          <div className="flex items-center text-gray-400 shrink-0">
            <Clock className="h-4 w-4 mr-1" />
            {new Date(form483.issueDate).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}