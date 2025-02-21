import React from 'react';
import { Building2, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface FDAActionCardProps {
  action: FDAAction;
}

export default function FDAActionCard({ action }: FDAActionCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    const path = action.type === 'Form 483' 
      ? `/form-483s/${action.id}`
      : `/warning-letters/${action.id}`;
    navigate(path);
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

  return (
    <div 
      className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
      onClick={handleClick}
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

      <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
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
  );
} 