import React from 'react';
import ProblematicSubsystems from './ProblematicSubsystems';
import SubsystemTrends from './SubsystemTrends';
import SixSystemDistribution from './SixSystemDistribution';
import TopInvestigators from '../TopInvestigators';

export default function SubsystemAnalytics() {
  return (
    <div className="space-y-8">
      {/* Full width Problematic Subsystems */}
      <ProblematicSubsystems />

      {/* Two charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SubsystemTrends />
        <SixSystemDistribution />
      </div>

      {/* Top Investigators */}
      <TopInvestigators />
    </div>
  );
}