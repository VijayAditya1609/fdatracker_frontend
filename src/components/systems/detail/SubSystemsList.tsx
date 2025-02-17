import React from 'react';
import { ChevronRight, Activity } from 'lucide-react';

interface SubSystemsListProps {
  systemId: string | undefined;
}

const SubSystemsList: React.FC<SubSystemsListProps> = ({ systemId }) => {
  const mockSubsystems = [
    {
      id: 1,
      name: 'Document Control',
      description: 'Management of quality system documentation',
      riskLevel: 'High',
      observations: 42,
      lastUpdated: '2024-02-15'
    },
    {
      id: 2,
      name: 'Quality Control Unit',
      description: 'Oversight of quality control activities',
      riskLevel: 'Medium',
      observations: 35,
      lastUpdated: '2024-02-10'
    },
    {
      id: 3,
      name: 'Quality Assurance',
      description: 'Quality system monitoring and review',
      riskLevel: 'Low',
      observations: 28,
      lastUpdated: '2024-02-05'
    },
    {
      id: 4,
      name: 'CAPA Management',
      description: 'Corrective and preventive action system',
      riskLevel: 'Medium',
      observations: 31,
      lastUpdated: '2024-02-01'
    }
  ];

  const getRiskBadgeColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'bg-red-400/10 text-red-400';
      case 'medium':
        return 'bg-yellow-400/10 text-yellow-400';
      default:
        return 'bg-green-400/10 text-green-400';
    }
  };

  return (
    <div className="space-y-4">
      {mockSubsystems.map(subsystem => (
        <div
          key={subsystem.id}
          className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="text-blue-400" />
                <h3 className="text-xl font-semibold text-white">{subsystem.name}</h3>
                <span className={`px-2 py-1 rounded-full text-sm ${getRiskBadgeColor(subsystem.riskLevel)}`}>
                  {subsystem.riskLevel} Risk
                </span>
              </div>
              <p className="text-gray-400 mb-4">{subsystem.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-gray-500">
                  {subsystem.observations} Observations
                </span>
                <span className="text-gray-500">
                  Last updated: {subsystem.lastUpdated}
                </span>
              </div>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubSystemsList;