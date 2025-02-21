import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, FileText, AlertTriangle, TrendingUp, Scale, Brain, Clock, CheckCircle, XCircle, Activity } from 'lucide-react';
import { Form483Observation } from '../../types/form483';
import ObservationCard from './observations/ObservationCard';

interface ObservationsTabProps {
  observations: Form483Observation[];
  pdfId: string | number;
}

export default function ObservationsTab({ observations, pdfId }: ObservationsTabProps) {
  const [selectedProcessType, setSelectedProcessType] = useState<string | null>(null);

  // Get unique process types across all observations
  const processTypes = Array.from(new Set(
    observations.flatMap(obs => 
      obs.process_types_affected.map(type => type.process_type)
    )
  ));

  // Calculate statistics
  const totalObservations = observations.length;
  const totalProcessTypes = processTypes.length;

  // Filter observations based on selected process type
  const filteredObservations = selectedProcessType
    ? observations.filter(obs =>
        obs.process_types_affected.some(type => 
          type.process_type === selectedProcessType
        )
      )
    : observations;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Total Observations</div>
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">{totalObservations}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Sub-systems</div>
            <Activity className="h-5 w-5 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">{totalProcessTypes}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Filter By Sub-system</div>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="mt-2 w-full bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-300 px-3 py-1"
            value={selectedProcessType || ''}
            onChange={(e) => setSelectedProcessType(e.target.value || null)}
          >
            <option value="">All Sub-systems</option>
            {processTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Observations List */}
      <div className="space-y-4">
        {filteredObservations.map((observation) => (
          <ObservationCard
            key={observation.id}
            observation={observation}
            pdfId={pdfId}
          />
        ))}
      </div>
    </div>
  );
}