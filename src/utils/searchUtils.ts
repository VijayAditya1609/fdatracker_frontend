import { ProcessedSystem } from '../types/system';

export function searchSystemsAndSubsystems(systems: ProcessedSystem[], searchQuery: string): ProcessedSystem[] {
  if (!searchQuery.trim()) {
    return systems;
  }

  const query = searchQuery.toLowerCase().trim();

  return systems.filter(system => {
    // Check system name and description
    if (
      system.name.toLowerCase().includes(query) ||
      system.description.toLowerCase().includes(query)
    ) {
      return true;
    }

    // Check subsystems
    const hasMatchingSubsystem = system.topSubSystems.some(
      subsystem => subsystem.name.toLowerCase().includes(query)
    );

    // If we have allSubSystems, check those too
    const hasMatchingAllSubsystem = system.allSubSystems?.some(
      subsystem => 
        subsystem.name.toLowerCase().includes(query) ||
        (subsystem.description?.toLowerCase().includes(query))
    );

    return hasMatchingSubsystem || hasMatchingAllSubsystem;
  });
} 