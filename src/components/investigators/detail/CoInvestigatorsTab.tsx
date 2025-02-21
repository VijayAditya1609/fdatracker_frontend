import React, { useState, useEffect } from 'react';
import { Users, Activity, ArrowRight, Loader2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../../../services/authFetch';
import { api } from '../../../config/api';

interface CoInvestigator {
  name: string;
  count: string;
  coInvestigatorId: string;
}

interface CoInvestigatorsTabProps {
  investigatorId: string;
}

export default function CoInvestigatorsTab({ investigatorId }: CoInvestigatorsTabProps) {
  const [coInvestigators, setCoInvestigators] = useState<CoInvestigator[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoInvestigators = async () => {
      try {
        setIsLoading(true);
        const response = await authFetch(`${api.coInvestigators}?id=${investigatorId}`);
        if (!response.ok) throw new Error('Failed to fetch co-investigators');
        const data = await response.json();
        if (data?.coInvestigatorsMap) {
          setCoInvestigators(data.coInvestigatorsMap);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load co-investigators');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCoInvestigators();
  }, [investigatorId]);

  // Navigate to investigator profile with explicit overview tab selection
  const navigateToInvestigator = (coinvestigatorId: string) => {
    // Navigate to the investigator detail page with the 'overview' tab explicitly selected
    navigate(`/investigators/${coinvestigatorId}?tab=overview`);
  };

  // Filter co-investigators based on search query
  const filteredCoInvestigators = coInvestigators
    .filter(investigator => 
      investigator.count !== undefined && 
      (investigator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       investigator.coInvestigatorId.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => Number(b.count) - Number(a.count));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-12">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search co-investigators by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg
                     bg-gray-800 text-gray-300 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* No Results Message */}
      {filteredCoInvestigators.length === 0 && !isLoading && (
        <div className="text-center text-gray-400 py-12">
          {coInvestigators.length === 0 
            ? "No co-investigators found."
            : "No co-investigators match your search."}
        </div>
      )}

      {/* Co-investigators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoInvestigators.map((investigator) => (
          <div
            key={investigator.coInvestigatorId}
            className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors cursor-pointer"
            onClick={() => navigateToInvestigator(investigator.coInvestigatorId)}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-700 rounded-lg">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">{investigator.name}</h4>
                  <span className="text-sm text-gray-400">ID: {investigator.coInvestigatorId}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-5 w-5 text-purple-400" />
                <span className="text-lg font-semibold text-white">{investigator.count}</span>
              </div>
              <p className="text-sm text-gray-400">Joint Inspections</p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700">
              <button 
                className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the parent div's onClick
                  navigateToInvestigator(investigator.coInvestigatorId);
                }}
              >
                View Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}