import React from 'react';
import { Activity, AlertCircle, CheckCircle, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { ProcessTypeAffected } from '../../../types/warningLetter';

interface ProcessAnalysisProps {
  processTypes: ProcessTypeAffected[];
  activeProcessType: string | null;
}

export default function ProcessAnalysis({ processTypes, activeProcessType }: ProcessAnalysisProps) {
  return (
    <div className="space-y-6">
      {processTypes
        .filter(process => process.processType === activeProcessType)
        .map((process, index) => (
          <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-400 mb-2">Key Observation</h4>
                  <p className="text-gray-300">{process.keyObservation}</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-400 mb-2">Failure Cause</h4>
                  <p className="text-gray-300">{process.failureCause}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Excerpt from Violation</h4>
                  <p className="text-gray-300 italic">{process.excerptFromViolation}</p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-purple-400 mb-2">Justification</h4>
                  <p className="text-gray-300">{process.justification}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}