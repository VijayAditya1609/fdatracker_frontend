import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useRecentFDAActions } from '../../hooks/useRecentFDAActions';
import FDAActionCard from './FDAActionCard';

export default function RecentForm483s() {
  const { actions, loading, error } = useRecentFDAActions();
  const form483s = actions
  .filter(action => action.type === 'Form 483')
  .map(action => ({
    ...action,
    status: action.status || false // Default to false if not present
  }))
  .slice(0, 5);

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

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Recent Form 483s</h3>
          <p className="text-sm text-gray-400 mt-1">Latest Form 483 Inspections</p>
        </div>
      </div>

      <div className="space-y-4">
        {form483s.map((action) => (
          <FDAActionCard key={action.id} action={action} />
        ))}
      </div>
    </div>
  );
} 