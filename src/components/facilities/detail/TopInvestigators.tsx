import React from 'react';
import { Users } from 'lucide-react';
import { TopInvestigator } from '../../../services/facility';

interface TopInvestigatorsProps {
  investigators: TopInvestigator[];
}

export default function TopInvestigators({ investigators }: TopInvestigatorsProps) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Top Investigators</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {investigators.map((investigator, index) => (
          <div
            key={index}
            className="bg-gray-700/50 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="text-white">{investigator.investigator}</span>
              </div>
              <span className="text-sm text-gray-400">
                {investigator.count} inspections
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}