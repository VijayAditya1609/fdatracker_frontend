import React from 'react';
import { Activity, FileText, AlertTriangle, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import { ProcessedSystem } from '../../types/system';
import { getRiskColor, getRiskBgColor } from '../../utils/systemCalculations';
import { useNavigate } from 'react-router-dom';

interface SystemCardProps {
  system: ProcessedSystem;
  searchQuery?: string;
}

export default function SystemCard({ system, searchQuery = '' }: SystemCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/systems/${system.id}`, {
      state: { systemName: system.name, description: system.description }
    });
  };

  const handleSubsystemClick = (e: React.MouseEvent, subsystemName: string) => {
    e.stopPropagation(); // Prevent triggering the parent card's onClick
    navigate(`/systems/${system.id}/subsystems/${encodeURIComponent(subsystemName)}`);
  };

  const highlightMatchingText = (text: string) => {
    if (!searchQuery) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <span key={i} className="bg-blue-400/20 text-blue-400">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      onClick={handleClick}
      className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-700 rounded-lg">
            <Activity className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{system.name}</h3>
            <p className="mt-1 text-sm text-gray-400 line-clamp-2">{system.description}</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <FileText className="h-5 w-5 text-purple-400" />
            <span className="text-lg font-semibold text-white">{system.form483Count}</span>
          </div>
          <p className="text-sm text-gray-400">Form 483s</p>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <span className="text-lg font-semibold text-white">{system.warningLetterCount}</span>
          </div>
          <p className="text-sm text-gray-400">Warning Letters</p>
        </div>

        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-blue-400" />
            <span className="text-lg font-semibold text-white">{system.totalCount}</span>
          </div>
          <p className="text-sm text-gray-400">Total Findings</p>
        </div>
      </div>

      {/* Top Subsystems */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Top Subsystems</h4>
        <div className="space-y-2">
          {system.topSubSystems.map((subSystem, index) => (
            <div
              key={subSystem.name}
              onClick={(e) => handleSubsystemClick(e, subSystem.name)}
              className="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 
                        transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2">
                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium
                  ${index === 0 ? 'bg-yellow-400/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-400/20 text-gray-400' :
                    'bg-orange-400/20 text-orange-400'}`}
                >
                  {index + 1}
                </span>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {highlightMatchingText(subSystem.name)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-400">{subSystem.count}</span>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend
      <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-400">
          <span className="font-medium text-white mr-2">{system.totalCount}</span>
          Total Findings
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {system.trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-red-400 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-400 mr-1" />
            )}
            <span className={system.trend === 'up' ? 'text-red-400' : 'text-green-400'}>
              {system.trendValue}
            </span>
          </div>
        </div>
      </div> */}
    </div>
  );
}