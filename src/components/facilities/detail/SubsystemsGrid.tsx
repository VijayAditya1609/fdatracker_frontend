import React from 'react';
import { ProcessTypesCount } from '../../../services/facility';

interface SubsystemsGridProps {
  subsystems: ProcessTypesCount;
}

export default function SubsystemsGrid({ subsystems }: SubsystemsGridProps) {
  const hasSubsystems = Object.keys(subsystems).length > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {hasSubsystems ? (
        Object.entries(subsystems).map(([name, count]) => (
          <div
            key={name}
            className="bg-gray-800 rounded-lg border border-gray-700 p-4 shadow-sm"
          >
            <h4 className="text-base font-medium text-white">{name}</h4>
            <span className="inline-block mt-2 rounded bg-blue-500 px-3 py-1 text-xs font-medium text-white">
              {count} citations
            </span>
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