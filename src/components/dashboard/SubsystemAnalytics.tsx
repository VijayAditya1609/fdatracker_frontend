import React from 'react';
import ProblematicSubsystems from './SubsystemAnalytics/ProblematicSubsystems';
import SubsystemTrends from './SubsystemAnalytics/SubsystemTrends';
import SixSystemDistribution from './SubsystemAnalytics/SixSystemDistribution';

export default function SubsystemAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProblematicSubsystems />
        <SubsystemTrends />
      </div>
      <SixSystemDistribution />
    </div>
  );
}