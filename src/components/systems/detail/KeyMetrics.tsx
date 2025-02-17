import React from 'react';
import { AlertTriangle, AlertOctagon, AlertCircle } from 'lucide-react';

interface KeyMetricsProps {
  metrics: {
    totalObservations: number;
    criticalObservations: number;
    majorObservations: number;
    minorObservations: number;
  };
}

const KeyMetrics: React.FC<KeyMetricsProps> = ({ metrics }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Key Metrics</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertOctagon className="text-red-400" />
            <span className="text-gray-300">Critical</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{metrics.criticalObservations}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-400" />
            <span className="text-gray-300">Major</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{metrics.majorObservations}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-blue-400" />
            <span className="text-gray-300">Minor</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{metrics.minorObservations}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">
              <span className="text-white text-sm">Σ</span>
            </div>
            <span className="text-gray-300">Total</span>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{metrics.totalObservations}</p>
        </div>
      </div>
    </div>
  );
};

export default KeyMetrics;