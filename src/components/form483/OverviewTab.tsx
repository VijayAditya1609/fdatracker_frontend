import React from 'react';
import CriticalMetrics from './CriticalMetrics';
import InspectionSummary from './InspectionSummary';
import { Form483Response } from '../../types/form483';

interface OverviewTabProps {
  data: Form483Response;
}

export default function OverviewTab({ data }: OverviewTabProps) {
  const { form483Details } = data;

  // Extract unique systems cited from observations
  const systemsCited = Array.from(new Set(
    form483Details.keyObservations.flatMap(obs => 
      obs.process_types_affected.map(type => type.process_type)
    )
  ));

  // Calculate inspection days
  const startDate = new Date(form483Details.inspectionDates[0]);
  const endDate = new Date(form483Details.inspectionDates[1]);
  const inspectionDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;

  return (
    <div className="space-y-6">
      <CriticalMetrics
        observationCount={form483Details.keyObservations.length}
        systemsCited={systemsCited}
        inspectionDays={inspectionDays}
        riskScore={8.5} // Example value
        previousFindings={3} // Example value
        repeatObservations={2} // Example value
      />

      <InspectionSummary
        facilityName={form483Details.facilityName}
        feiNumber={form483Details.feinumber}
        address={form483Details.addressOfTheIssue}
        issueDate={form483Details.issueDate}
        inspectionDates={form483Details.inspectionDates}
        investigators={form483Details.investigators || []}
      />

      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
        <p className="text-gray-300 leading-relaxed">{data.summary483.summary_483}</p>
      </div>
    </div>
  );
}