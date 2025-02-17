import React from 'react';
import { User, Activity, FileWarning, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { InvestigatorListItem } from '../../types/investigator';

interface InvestigatorCardProps {
  investigator: InvestigatorListItem;
  onClick: () => void;
}

export default function InvestigatorCard({ investigator, onClick }: InvestigatorCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-400/10 text-green-400';
      case 'moderately active':
        return 'bg-yellow-400/10 text-yellow-400';
      default:
        return 'bg-gray-400/10 text-gray-400';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-700 rounded-lg">
            <User className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{investigator.investigator_name}</h3>
            <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(investigator.activityStatus)}`}>
              {investigator.activityStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-blue-400" />
            <span className="text-lg font-semibold text-white">{investigator.investigator_count}</span>
          </div>
          <p className="text-sm text-gray-400">Total Form 483s</p>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <FileWarning className="h-5 w-5 text-yellow-400" />
            <span className="text-lg font-semibold text-white">{investigator.warning_letter_count}</span>
          </div>
          <p className="text-sm text-gray-400">Warning Letters</p>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-purple-400" />
            <span className="text-lg font-semibold text-white">{investigator.conversion_rate}%</span>
          </div>
          <p className="text-sm text-gray-400">Conversion Rate</p>
        </div>
      </div>

      {investigator.lastIssuedDate && (
        <div className="flex items-center text-sm text-gray-400">
          <Clock className="h-4 w-4 mr-2" />
          Last Activity: {new Date(investigator.lastIssuedDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
