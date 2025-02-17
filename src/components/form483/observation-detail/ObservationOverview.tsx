import React from 'react';
import { Activity, FileText, AlertCircle } from 'lucide-react';
import { Form483Observation } from '../../../types/form483';

interface ObservationOverviewProps {
  observation: Form483Observation;
}

export default function ObservationOverview({ observation }: ObservationOverviewProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Basic Information */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Observation Number</label>
            <p className="mt-1 text-white">{observation.observationNumber}</p>
          </div>
          <div>
            <label className="text-sm text-gray-400">Summary</label>
            <p className="mt-1 text-white">{observation.observation_summary}</p>
          </div>
          {observation.observationText && (
            <div>
              <label className="text-sm text-gray-400">Full Text</label>
              <p className="mt-1 text-white">{observation.observationText}</p>
            </div>
          )}
        </div>
      </div>

      {/* Process Types Summary */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Sub-system Affected</h3>
        <div className="space-y-4">
          {observation.process_types_affected.map((process, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-blue-400 mr-3" />
                <span className="text-white">{process.process_type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}