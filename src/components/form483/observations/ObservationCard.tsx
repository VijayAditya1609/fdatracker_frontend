import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form483Observation } from '../../../types/form483';

interface ObservationCardProps {
  observation: Form483Observation;
  pdfId: string | number; // Add pdfId prop
}

export default function ObservationCard({ observation, pdfId }: ObservationCardProps) {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/form-483s/${pdfId}/analysis/${observation.id}`);
  };

  return (
    <div
    className="bg-gray-800 hover:bg-gray-700 transition-transform transform hover:scale-[1.02] shadow-md hover:shadow-lg rounded-lg border border-gray-700 overflow-hidden cursor-pointer hover:border-gray-600 transition-colors"
    onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold text-white">
              Observation {observation.observationNumber}
            </span>
            <div className="flex items-center space-x-2 flex-wrap">
              {observation.process_types_affected.map((processType, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-blue-400/10 px-2.5 py-1 text-xs font-medium text-blue-400"
                >
                  {processType.process_type}
                </span>
              ))}
            </div>            
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-300">
          {observation.observation_summary}
        </p>
      </div>
    </div>
  );
}

