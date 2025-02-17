import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useRecentFDAActions } from '../../hooks/useRecentFDAActions';
import FDAActionCard from './FDAActionCard';

export default function RecentWarningLetters() {
  const { actions, loading, error } = useRecentFDAActions();
  const warningLetters = actions.filter(action => action.type === 'Warning Letter').slice(0, 5);

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
          <h3 className="text-lg font-semibold text-white">Recent Warning Letters</h3>
          <p className="text-sm text-gray-400 mt-1">Latest FDA Warning Letters</p>
        </div>
      </div>

      <div className="space-y-4">
        {warningLetters.map((action) => (
          <FDAActionCard key={action.id} action={action} />
        ))}
      </div>
    </div>
  );
} 