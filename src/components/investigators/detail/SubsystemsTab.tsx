import React from 'react';
import SystemsChart from './SystemsChart';

interface SubsystemsTabProps {
  processTypesCount: Record<string, number>;
}

export default function SubsystemsTab({ processTypesCount }: SubsystemsTabProps) {
  return <SystemsChart processTypesCount={processTypesCount} />;
}