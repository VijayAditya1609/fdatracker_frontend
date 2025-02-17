import React from 'react';
import { CheckCircle, AlertTriangle, Target, ArrowRight } from 'lucide-react';
import { ChecklistItem } from '../../../types/form483';

interface ChecklistAnalysisProps {
  checklist: ChecklistItem[];
}

export default function ChecklistAnalysis({ checklist }: ChecklistAnalysisProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
        <h4 className="text-sm font-medium text-white">Compliance Checklist</h4>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {checklist.map((item, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <Target className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-white">{item.question}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center mb-1">
                        <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
                        <span className="text-xs font-medium text-gray-400">Potential Failure</span>
                      </div>
                      <p className="text-sm text-gray-300 ml-6">{item.potential_failure}</p>
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                        <span className="text-xs font-medium text-gray-400">Acceptance Criteria</span>
                      </div>
                      <p className="text-sm text-gray-300 ml-6">{item.acceptance_criteria}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <ArrowRight className="h-4 w-4 text-blue-400 mr-2" />
                      <span className="text-xs font-medium text-gray-400">Required Action</span>
                    </div>
                    <p className="text-sm text-gray-300 ml-6">{item.required_action}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}