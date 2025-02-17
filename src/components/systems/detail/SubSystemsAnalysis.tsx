import React from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
// import type { SystemReport } from '../../types/system';
import type { SystemReport } from '../../../types/system';

interface SubSystemsAnalysisProps {
  subSystems: SystemReport['subSystems'];
}

export default function SubSystemsAnalysis({ subSystems }: SubSystemsAnalysisProps) {
  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 8) return 'bg-red-400/10';
    if (score >= 6) return 'bg-yellow-400/10';
    return 'bg-green-400/10';
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white">Sub-Systems Analysis</h3>
      
      <div className="grid gap-6">
        {subSystems.map((subSystem) => (
          <div
            key={subSystem.name}
            className="bg-gray-800 rounded-lg border border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-700 rounded-lg">
                  <Activity className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">{subSystem.name}</h4>
                  <div className="flex items-center mt-1">
                    {subSystem.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-red-400 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-400 mr-1" />
                    )}
                    <span className={subSystem.trend === 'up' ? 'text-red-400' : 'text-green-400'}>
                      {subSystem.trendValue}
                    </span>
                    <span className="text-gray-400 ml-2">vs last year</span>
                  </div>
                </div>
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
                ${getRiskBgColor(subSystem.riskScore)} ${getRiskColor(subSystem.riskScore)}`}>
                Risk Score: {subSystem.riskScore}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400">Total Citations</div>
                <div className="mt-2 text-2xl font-semibold text-white">{subSystem.totalCount}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400">Form 483s</div>
                <div className="mt-2 text-2xl font-semibold text-white">{subSystem.form483Count}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-sm text-gray-400">Warning Letters</div>
                <div className="mt-2 text-2xl font-semibold text-white">{subSystem.warningLetterCount}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}