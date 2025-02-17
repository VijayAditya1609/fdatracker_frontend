import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Clock, Activity, FileText, Shield } from 'lucide-react';

interface CriticalMetricsProps {
  observationCount: number;
  systemsCited: string[];
  inspectionDays: number;
  riskScore: number;
  previousFindings: number;
  repeatObservations: number;
}

export default function CriticalMetrics({
  observationCount,
  systemsCited,
  inspectionDays,
  riskScore,
  previousFindings,
  repeatObservations
}: CriticalMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
      {/* Systems Impact */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">SubSystems Impacted</span>
          </div>
          <span className="text-2xl font-bold text-white">{systemsCited.length}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {systemsCited.map((system, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-blue-400/10 px-2.5 py-1 text-xs font-medium text-blue-400"
            >
              {system}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}