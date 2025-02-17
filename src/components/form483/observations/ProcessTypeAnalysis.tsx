import React, { useState } from 'react';
import { Activity, AlertCircle, CheckCircle, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { ProcessTypeAffected } from '../../../types/form483';

interface ProcessTypeAnalysisProps {
  processType: ProcessTypeAffected;
}

export default function ProcessTypeAnalysis({ processType }: ProcessTypeAnalysisProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-700/50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Activity className="h-5 w-5 text-blue-400" />
          <h4 className="text-sm font-medium text-white">{processType.process_type}</h4>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-gray-300"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-400 mb-2">Key Observation</div>
                <p className="text-sm text-gray-300">{processType.key_observation}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-sm font-medium text-red-400 mb-2">Root Cause</div>
                <p className="text-sm text-gray-300">{processType.root_cause}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-sm font-medium text-green-400 mb-2">Corrective Action</div>
                <p className="text-sm text-gray-300">{processType.corrective_action}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-sm font-medium text-yellow-400 mb-2">Preventive Action</div>
                <p className="text-sm text-gray-300">{processType.preventive_action}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-sm font-medium text-purple-400 mb-2">Justification</div>
            <p className="text-sm text-gray-300">{processType.justification}</p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-400 mb-2">Excerpt from Observation</div>
            <p className="text-sm text-gray-300 italic">{processType.excerpt_from_observation}</p>
          </div>
        </div>
      )}
    </div>
  );
}