import React, { useState } from 'react';
import { Activity, ChevronRight, FileText, AlertTriangle, AlertCircle, TrendingUp, Search } from 'lucide-react';
import type { SystemReport } from '../../../types/system';
import useDebounce from '../../../hooks/useDebounce';

interface SubsystemsListTabProps {
  systemReport: SystemReport;
  onSubsystemClick: (subsystemId: string) => void;
  dateRange: string;
}

interface SubsystemInfo {
  id: string;
  name: string;
  description: string;
  observationCount: number;
  violationCount: number; 
  form483Count: number;
  warningLetterCount: number;
  totalFindings: number;
  riskLevel: 'High Risk' | 'Medium Risk' | 'Low Risk';
  lastUpdated: string;
}

const getRiskLevelClass = (riskLevel: string) => {
  switch (riskLevel) {
    case 'High Risk':
      return 'bg-red-400/10 text-red-400';
    case 'Medium Risk':
      return 'bg-yellow-400/10 text-yellow-400';
    case 'Low Risk':
      return 'bg-green-400/10 text-green-400';
    default:
      return 'bg-gray-400/10 text-gray-400';
  }
};

export default function SubsystemsListTab({ systemReport, onSubsystemClick, dateRange }: SubsystemsListTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  if (!systemReport || !systemReport.subSystems) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <AlertTriangle className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
        <p className="text-gray-400">No subsystem data available</p>
      </div>
    );
  }

  try {
    const subsystems: SubsystemInfo[] = Object.entries(systemReport.subSystems)
      .map(([id, data]) => {
        if (!id || !data) {
          console.warn(`Invalid subsystem data for id: ${id}`);
          return null;
        }

        const sanitizedId = id.trim();
        if (!sanitizedId) {
          console.warn('Empty subsystem ID detected');
          return null;
        }

        return {
          id: sanitizedId,
          name: sanitizedId,
          description: getSubsystemDescription(sanitizedId),
          form483Count: data.total483sIssued || 0,
          warningLetterCount: data.total483sConverted || 0,
          totalFindings: (data.total483sIssued || 0) + (data.total483sConverted || 0),
          observationCount: data.totalObservations || 0,
          riskLevel: data.totalObservations > 40 ? 'High Risk' : 
                    data.totalObservations > 20 ? 'Medium Risk' : 'Low Risk' as const,
          lastUpdated: '2024-02-15'
        };
      })
      .filter((subsystem): subsystem is SubsystemInfo => {
        if (!subsystem || !subsystem.id) {
          console.warn('Filtered out invalid subsystem:', subsystem);
          return false;
        }
        
        if (!debouncedSearch) return true;
        
        try {
          const search = debouncedSearch.toLowerCase();
          return (
            subsystem.name.toLowerCase().includes(search) ||
            subsystem.description.toLowerCase().includes(search)
          );
        } catch (err) {
          console.error('Search filter error:', err);
          return false;
        }
      })
      .sort((a, b) => b.form483Count - a.form483Count);

    if (error) setError(null);

    if (subsystems.length === 0) {
      return (
        <div>
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subsystems..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 
                         text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400">
              {debouncedSearch 
                ? `No subsystems found matching "${debouncedSearch}"`
                : 'No subsystems available'}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div>
        {/* Search Input */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subsystems..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 
                       text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Subsystems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {subsystems.map((subsystem) => (
            <div
              key={subsystem.id}
              onClick={() => {
                if (subsystem.id) {
                  console.log('Clicking subsystem:', subsystem.id);
                  onSubsystemClick(subsystem.id);
                } else {
                  console.warn('Attempted to click subsystem with invalid ID');
                }
              }}
              className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      subsystems.indexOf(subsystem) === 0 ? 'bg-yellow-400/20' :
                      subsystems.indexOf(subsystem) === 1 ? 'bg-gray-400/20' :
                      subsystems.indexOf(subsystem) === 2 ? 'bg-orange-400/20' :
                      'bg-gray-700'
                    }`}>
                      <Activity className={`h-5 w-5 ${
                        subsystems.indexOf(subsystem) === 0 ? 'text-yellow-400' :
                        subsystems.indexOf(subsystem) === 1 ? 'text-gray-400' :
                        subsystems.indexOf(subsystem) === 2 ? 'text-orange-400' :
                        'text-blue-400'
                      }`} />
                    </div>
                    <h3 className="text-lg font-medium text-white">{subsystem.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {subsystems.indexOf(subsystem) < 3 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-300">
                        #{subsystems.indexOf(subsystem) + 1} 
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </div>

              <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                {subsystem.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-semibold text-white">{subsystem.form483Count}</span>
                  </div>
                  <p className="text-xs text-gray-400">Form 483s</p>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-sm font-semibold text-white">{subsystem.warningLetterCount}</span>
                  </div>
                  <p className="text-xs text-gray-400">Warning Letters</p>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <TrendingUp className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-semibold text-white">{subsystem.totalFindings}</span>
                  </div>
                  <p className="text-xs text-gray-400">Total Findings</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    setError(errorMessage);
    
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
        <p className="text-red-400">Error: {errorMessage}</p>
      </div>
    );
  }
}

function getSubsystemDescription(id: string): string {
  const descriptions: { [key: string]: string } = {
    'Document Control': 'Management of quality system documentation and records',
    'Quality Control Unit': 'Oversight of quality control activities and testing',
    'Quality Assurance': 'Quality system monitoring and continuous improvement',
    'CAPA Management': 'Corrective and preventive action system management',
    'Training': 'Personnel training and qualification management',
    'Equipment Management': 'Equipment calibration and maintenance tracking'
  };
  return descriptions[id] || 'System component management and oversight';
} 