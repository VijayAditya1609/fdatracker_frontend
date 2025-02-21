import React from 'react';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Violation } from '../../../types/warningLetter';

interface ViolationCardProps {
  violation: Violation;
  warningLetterId: string | number;
}

export default function ViolationCard({ violation, warningLetterId }: ViolationCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/warning-letters/${warningLetterId}/analysis/${violation.id}`);
  };

  return (
    <div
      className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden cursor-pointer hover:border-gray-600 transition-colors"
      onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2 sm:space-x-4">
            <span className="text-lg font-semibold text-white">
              Violation {violation.violationNumber}
            </span>
            <div className="flex flex-wrap items-center gap-2 sm:space-x-2">
              {violation.process_types_affected.map((processType, index) => (

                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-blue-400/10 px-2.5 py-1 text-xs font-medium text-blue-400"
                >
                  {processType.processType}
                </span>
              ))}

              <span className="inline-flex items-center rounded-full bg-yellow-400/10 px-2.5 py-1 text-xs font-medium text-yellow-400">
                {violation.cfrCode}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-300">
          {violation.summary}
        </p>
      </div>
    </div>
  );
}