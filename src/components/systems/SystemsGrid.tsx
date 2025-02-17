import React from 'react';
import SystemCard from './SystemCard';
import { ProcessedSystem } from '../../types/system';
import { searchSystemsAndSubsystems } from '../../utils/searchUtils';

interface SystemsGridProps {
  systems: ProcessedSystem[];
  searchQuery?: string;
}

export default function SystemsGrid({ systems, searchQuery = '' }: SystemsGridProps) {
  const filteredSystems = searchSystemsAndSubsystems(systems, searchQuery);

  if (filteredSystems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">
          No systems or subsystems found matching "{searchQuery}"
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 grid-cols-1 lg:grid-cols-2">
      {filteredSystems.map((system) => (
        <SystemCard key={system.id} system={system} />
      ))}
    </div>
  );
}