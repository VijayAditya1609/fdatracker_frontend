import { useState, useEffect, useMemo } from 'react';
import { getSixSystemsList } from '../services/sixSystems';
import { SixSystemsResponse, ProcessedSystem } from '../types/system';
import { systemDescriptions } from '../constants/systemMappings';
import { 
  calculateTrend, 
  calculateTrendValue, 
  getTopSubSystems 
} from '../utils/systemCalculations';

export default function useSixSystems(searchQuery: string) {
  const [systemsData, setSystemsData] = useState<SixSystemsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        setIsLoading(true);
        const data = await getSixSystemsList();
        setSystemsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load systems');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystems();
  }, []);

  const filteredSystems = useMemo(() => {
    if (!systemsData) return [];

    const searchLower = searchQuery.toLowerCase().trim();

    return Object.entries(systemsData)
      .filter(([systemName, data]) => {
        // If no search query, show all systems
        if (!searchLower) return true;

        // Check system name
        if (systemName.toLowerCase().includes(searchLower)) {
          return true;
        }

        // Check subsystems
        const hasMatchingSubsystem = Object.keys(data.subSystems).some(
          subSystemName => subSystemName.toLowerCase().includes(searchLower)
        );

        return hasMatchingSubsystem;
      })
      .map(([systemName, data]): ProcessedSystem => {
        const form483Count = Object.values(data.subSystems)
          .reduce((sum, sub) => sum + sub.form483Count, 0);
        const warningLetterCount = Object.values(data.subSystems)
          .reduce((sum, sub) => sum + sub.warningLetterCount, 0);
        const totalCount = Object.values(data.subSystems)
          .reduce((sum, sub) => sum + sub.totalCount, 0);

        // Get all subsystems for the system
        const allSubSystems = Object.entries(data.subSystems).map(([name, stats]) => ({
          name,
          count: stats.totalCount
        }));

        // Get top subsystems (this might already filter or sort them)
        const topSubSystems = getTopSubSystems(data.subSystems);

        return {
          id: data.systemId.toString(),
          name: systemName,
          description: systemDescriptions[systemName] || '',
          form483Count,
          warningLetterCount,
          totalCount,
          // riskScore: calculateRiskScore(data),
          trend: calculateTrend(data),
          trendValue: calculateTrendValue(data),
          topSubSystems,
          allSubSystems // Include all subsystems in the processed data
        };
      });
  }, [systemsData, searchQuery]);

  return {
    systems: filteredSystems,
    isLoading,
    error
  };
}