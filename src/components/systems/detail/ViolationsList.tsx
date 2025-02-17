import React from 'react';
import { Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

interface Violation {
  company_affected: string;
  issue_date: string;
  key_observation: string;
  failure_cause: string;
  corrective_actions: string;
  preventive_actions: string;
  process_type: string;
  justification: string;
  excerpt_from_violation: string;
  escalation_analysis: string;
}

interface ViolationsListProps {
  violations: Violation[];
}

export default function ViolationsList({ violations }: ViolationsListProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {violations.map((violation, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg border border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-white">
                  {violation.company_affected}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                  <Calendar className="h-4 w-4" />
                  {new Date(violation.issue_date).toLocaleDateString()}
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-red-400/10 px-2.5 py-1 text-xs font-medium text-red-400">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Violation
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400">Key Observation</h4>
                <p className="mt-1 text-white">{violation.key_observation}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400">Failure Cause</h4>
                <p className="mt-1 text-white">{violation.failure_cause}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400">Excerpt from Violation</h4>
                <p className="mt-1 text-white">{violation.excerpt_from_violation}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Corrective Actions</h4>
                  <p className="mt-1 text-white">{violation.corrective_actions}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Preventive Actions</h4>
                  <p className="mt-1 text-white">{violation.preventive_actions}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Process Type</h4>
                  <p className="mt-1 text-white">{violation.process_type}</p>
                </div>
                {violation.escalation_analysis === 't' && (
                  <span className="inline-flex items-center rounded-full bg-yellow-400/10 px-2.5 py-1 text-xs font-medium text-yellow-400">
                    Escalated
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 