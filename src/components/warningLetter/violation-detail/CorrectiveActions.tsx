import React from 'react';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { ProcessTypeAffected } from '../../../types/warningLetter';

interface CorrectiveActionsProps {
  processTypes: ProcessTypeAffected[];
  activeProcessType: string | null;
}

export default function CorrectiveActions({ processTypes, activeProcessType }: CorrectiveActionsProps) {
  return (
    <div className="space-y-6">
      {processTypes
        .filter(process => process.processType === activeProcessType)
        .map((process, index) => (
          <div key={index} className="space-y-6">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <h4 className="text-sm font-medium text-green-400">Corrective Action</h4>
                  </div>
                  <p className="text-gray-300">{process.correctiveAction}</p>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <h4 className="text-sm font-medium text-yellow-400">Preventive Action</h4>
                  </div>
                  <p className="text-gray-300">{process.preventiveAction}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}