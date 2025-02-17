import React, { useEffect, useState } from 'react';
import { User, Activity, FileWarning, TrendingUp, Shield } from 'lucide-react';
import { getTopInvestigators } from '../../services/dashboard';
import type { TopInvestigator } from '../../services/dashboard';
import { useNavigate } from 'react-router-dom';

export default function TopInvestigators() {
  const navigate = useNavigate();
  const [investigators, setInvestigators] = useState<TopInvestigator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestigators = async () => {
      try {
        const data = await getTopInvestigators();
        const uniqueInvestigators = data.reduce((acc, current) => {
          const x = acc.find(item => item.investigator_name === current.investigator_name);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, [] as TopInvestigator[]);
        setInvestigators(uniqueInvestigators);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load investigators');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestigators();
  }, []);

  const handleInvestigatorClick = (investigatorId: string) => {
    navigate(`/investigators/${investigatorId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400 animate-pulse">Loading investigators...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-400 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Top Investigators</h3>
          <p className="text-sm text-gray-400 mt-1">Performance metrics of leading FDA investigators</p>
        </div>
        <div className="p-2 bg-blue-400/10 rounded-lg">
          <User className="h-6 w-6 text-blue-400" />
        </div>
      </div>

      <div className="space-y-4">
        {investigators.map((investigator) => (
          <div 
            key={investigator.id} 
            className="group bg-gray-700/50 rounded-lg p-5 hover:bg-gray-700/70 transition-all duration-200 cursor-pointer hover:shadow-lg hover:shadow-gray-900/20"
            onClick={() => handleInvestigatorClick(investigator.id)}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-700 rounded-lg group-hover:bg-gray-600 transition-colors">
                  <User className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                    {investigator.investigator_name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full ${
                      investigator.activity_status === 'Active' 
                        ? 'bg-green-400/10 text-green-400' 
                        : 'bg-red-400/10 text-red-400'
                    }`}>
                      {investigator.activity_status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-blue-400/10 px-3 py-1.5 rounded-full">
                <span className="text-sm font-medium text-blue-400">
                  {investigator.conversion_rate}% CR
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 group-hover:bg-gray-800/70 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">{investigator.investigator_count}</span>
                </div>
                <p className="text-xs text-gray-400">Total Inspections</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 group-hover:bg-gray-800/70 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <FileWarning className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">{investigator.warning_letter_count}</span>
                </div>
                <p className="text-xs text-gray-400">Warning Letters</p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 group-hover:bg-gray-800/70 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-white">{investigator.conversion_rate}%</span>
                </div>
                <p className="text-xs text-gray-400">Conversion Rate</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}