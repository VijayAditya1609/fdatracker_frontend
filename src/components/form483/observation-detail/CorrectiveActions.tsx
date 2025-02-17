import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { ProcessTypeAffected } from '../../../types/form483';

interface CorrectiveActionsProps {
  processTypes: ProcessTypeAffected[];
  activeProcessType: string | null;
}

export default function CorrectiveActions({ processTypes, activeProcessType }: CorrectiveActionsProps) {
  return (
    <div className="space-y-6">
      {/* Active Process Type Details */}
      {processTypes
        .filter((process) => process.process_type === activeProcessType)
        .map((process, index) => (
          <div key={index} className="space-y-6">
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <h4 className="text-sm font-medium text-green-400">Corrective Action</h4>
                  </div>
                  <p className="text-gray-300">{process.corrective_action}</p>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    <h4 className="text-sm font-medium text-yellow-400">Preventive Action</h4>
                  </div>
                  <p className="text-gray-300">{process.preventive_action}</p>
                </div>
              </div>
            </div>

            {/* Checklist Items */}
            {process.checklist && process.checklist.length > 0 && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h4 className="text-lg font-semibold text-white mb-6">Compliance Checklist</h4>
                <div className="space-y-4">
                  {process.checklist.map((item, idx) => (
                    <div key={idx} className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="h-5 w-5 text-blue-400" />
                        <h5 className="text-sm font-medium text-white">{item.question}</h5>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Acceptance Criteria</p>
                          <p className="text-sm text-gray-300">{item.acceptance_criteria}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Required Action</p>
                          <p className="text-sm text-gray-300">{item.required_action}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}