import React, { useEffect, useState } from 'react';
import { Activity, FileText, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { getProblematicSubSystems } from '../../../services/dashboard';
import type { ProblematicSubSystem } from '../../../services/dashboard';
import { useNavigate } from 'react-router-dom';

interface ProblematicSubsystemsProps {
  dateRange: string;
}

export default function ProblematicSubsystems({ dateRange }: ProblematicSubsystemsProps) {
  const [subsystems, setSubsystems] = useState<ProblematicSubSystem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubsystems = async () => {
      try {
        const data = await getProblematicSubSystems(dateRange);
        setSubsystems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load subsystems');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubsystems();
  }, [dateRange]);

  const handleSubsystemClick = (processType: string, system_id: string) => {
    // Convert process type to URL-friendly format and navigate
    const formattedProcessType = processType.replace(/\s+/g, '%20');
    navigate(`/systems/${system_id}/subsystems/${formattedProcessType}`);
  };

  if (isLoading) {
    return <div className="text-center text-gray-400">Loading subsystems...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Most Cited Sub-Systems</h3>
          <p className="text-sm text-gray-400 mt-1">Top 5 sub-systems with highest citation rates</p>
        </div>
      </div>

      <div className="space-y-4">
        {subsystems.map((system, index) => {
          const topIssues = JSON.parse(system.top_issues) as string[];
          
          return (
            <div 
              key={index} 
              className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => handleSubsystemClick(system.process_type, system.system_id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-white">{system.process_type}</h4>
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-400/10 text-blue-400">
                      {system.system_name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-gray-800/50 rounded-lg p-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-blue-400 mr-1" />
                      <span className="text-xs text-gray-400">Form 483s</span>
                    </div>
                    <span className="text-sm font-medium text-white">{system.form483_count}</span>
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-red-400 mr-1" />
                      <span className="text-xs text-gray-400">Warning Letters</span>
                    </div>
                    <span className="text-sm font-medium text-white">
                      {system.warning_letter_count}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-xs text-gray-400 mb-2">Top Issues</div>
                <div className="flex flex-wrap gap-2">
                  {topIssues.map((issue, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-full bg-gray-800 px-2.5 py-1 text-xs text-gray-300"
                    >
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}