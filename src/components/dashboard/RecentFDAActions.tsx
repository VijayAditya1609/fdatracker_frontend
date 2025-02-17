import React, { useEffect, useState } from 'react';
import { AlertTriangle, FileText, Building2, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRecentFDAActions } from '../../services/dashboard';

interface FDAAction {
  id: number;
  type: string;
  facilityName: string;
  companyName: string | null;
  location: string;
  issueDate: string;
  systems: string[];
  numOfObservations?: number;
  numOfViolations?: number;
  status: boolean;
}

interface ErrorState {
  message: string;
  code?: number;
}

export default function RecentFDAActions() {
  const [recentActions, setRecentActions] = useState<FDAAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentActions = async () => {
      try {
        const data = await getRecentFDAActions();
        // Validate and clean the data
        const validatedData = data.map((action: any) => ({
          id: action.id || 0,
          type: action.type || 'Unknown',
          facilityName: action.facilityName || 'Unnamed Facility',
          companyName: action.companyName || null,
          location: action.location || 'Location Unknown',
          issueDate: action.issueDate || new Date().toISOString(),
          systems: Array.isArray(action.systems) ? action.systems.filter(Boolean) : [],
          numOfObservations: action.numOfObservations || 0,
          numOfViolations: action.numOfViolations || 0,
          status: Boolean(action.status)
        }));

        setRecentActions(validatedData);
      } catch (err) {
        console.error('Error fetching FDA actions:', err);
        setError({
          message: err instanceof Error ? err.message : 'Failed to fetch FDA actions',
          code: err instanceof Error ? 500 : undefined
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActions();
  }, []);

  const handleActionClick = (action: FDAAction) => {
    try {
      if (!action.id) {
        throw new Error('Invalid action ID');
      }
      const path = action.type === 'Form 483' 
        ? `/form-483s/${action.id}`
        : `/warning-letters/${action.id}`;
      navigate(path);
    } catch (err) {
      console.error('Navigation error:', err);
      setError({
        message: 'Failed to navigate to details page',
        code: 404
      });
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (err) {
      console.warn('Date formatting error:', err);
      return 'Invalid Date';
    }
  };

  const renderSystems = (systems: string[]) => {
    try {
      return systems
        .filter(system => system && system !== "NULL")
        .map((system, idx) => (
          <span
            key={idx}
            className="inline-flex items-center rounded-full bg-blue-400/10 px-2.5 py-1 text-xs font-medium text-blue-400"
          >
            {system.replace(/['"]+/g, '')}
          </span>
        ));
    } catch (err) {
      console.warn('Error rendering systems:', err);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="text-red-400 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Error: {error.message}</span>
        </div>
      </div>
    );
  }

  if (!recentActions.length) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="text-gray-400 text-center">No recent FDA actions found</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Recent FDA Actions</h3>
          <p className="text-sm text-gray-400 mt-1">Latest Form 483s and Warning Letters</p>
        </div>
      </div>
  
      <div className="space-y-4">
        {recentActions.map((action) => (
          <div 
            key={action.id} 
            className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => handleActionClick(action)}
            role="button"
            tabIndex={0}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-white">{action.facilityName}</h4>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    action.type === 'Warning Letter' 
                      ? 'bg-red-400/10 text-red-400' 
                      : 'bg-yellow-400/10 text-yellow-400'
                  }`}>
                    {action.type}
                  </span>
                </div>
                <div className="flex items-center mt-1 text-sm text-gray-400">
                  <Building2 className="h-4 w-4 mr-1.5" />
                  {action.companyName || action.facilityName}
                </div>
              </div>
            </div>
  
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="bg-gray-800/50 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-blue-400 mr-1" />
                    <span className="text-xs text-gray-400">Location</span>
                  </div>
                  <span className="text-sm font-medium text-white">{action.location}</span>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-blue-400 mr-1" />
                    <span className="text-xs text-gray-400">Issue Date</span>
                  </div>
                  <span className="text-sm font-medium text-white">{formatDate(action.issueDate)}</span>
                </div>
              </div>
            </div>
  
            <div className="mt-3">
              <div className="text-xs text-gray-400 mb-2">Systems Cited</div>
              <div className="flex flex-wrap gap-2">
                {renderSystems(action.systems)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}