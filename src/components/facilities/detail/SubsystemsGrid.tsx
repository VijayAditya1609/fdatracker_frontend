import React from 'react';
import { ProcessTypesCount } from '../../../services/facility';

interface SubsystemsGridProps {
  subsystems: ProcessTypesCount;
}

export default function SubsystemsGrid({ subsystems }: SubsystemsGridProps) {
  const hasSubsystems = Object.keys(subsystems).length > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {hasSubsystems ? (
        Object.entries(subsystems).map(([name, count]) => (
          <div
            key={name}
            className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex flex-col space-y-4">
              <h4 className="text-lg font-medium text-white">{name}</h4>
              <span className="inline-block rounded-full bg-blue-400/10 px-3 py-1 text-sm font-medium text-blue-400">
                {count} citations
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center text-gray-400">
          No subsystems available.
        </div>
      )}
    </div>
  );
}
