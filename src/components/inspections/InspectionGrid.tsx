import React from 'react';
import { Inspection } from '../../types/inspection';
import InspectionCard from './InspectionCard';

interface InspectionGridProps {
  inspections: Inspection[];
  onInspectionClick: (id: string) => void;
}

export default function InspectionGrid({ inspections, onInspectionClick }: InspectionGridProps) {
  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {inspections.map((inspection) => (
        <InspectionCard
          key={inspection.inspectionid}
          inspection={inspection}
          onClick={() => onInspectionClick(inspection.inspectionid)}
        />
      ))}
    </div>
  );
}