import React from 'react';

interface SystemicIssuesTreeProps {
  data: any;
}

export default function SystemicIssuesTree({ data }: SystemicIssuesTreeProps) {
  const issues = [
    {
      name: 'Quality System',
      severity: 'high',
      children: ['Documentation', 'Training', 'Procedures']
    },
    {
      name: 'Production',
      severity: 'medium',
      children: ['Process Controls', 'Equipment Maintenance']
    },
    {
      name: 'Laboratory',
      severity: 'low',
      children: ['Test Methods', 'Calibration']
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-500 bg-red-500/10 text-red-400';
      case 'medium':
        return 'border-yellow-500 bg-yellow-500/10 text-yellow-400';
      case 'low':
        return 'border-green-500 bg-green-500/10 text-green-400';
      default:
        return 'border-gray-500 bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {issues.map((issue, index) => (
        <div key={index} className="relative">
          {/* Main Issue Node */}
          <div className={`
            p-3 rounded-lg border 
            ${getSeverityColor(issue.severity)}
          `}>
            <div className="font-medium">{issue.name}</div>
          </div>

          {/* Children */}
          <div className="mt-4 ml-8 space-y-3">
            {issue.children.map((child, childIndex) => (
              <div key={childIndex} className="relative flex items-center">
                {/* Connector Line */}
                <div className="absolute -left-6 top-1/2 w-6 h-px bg-gray-600" />
                <div className="absolute -left-6 top-0 bottom-1/2 w-px bg-gray-600" />
                {childIndex === issue.children.length - 1 && (
                  <div className="absolute -left-6 bottom-1/2 top-[-12px] w-px bg-gray-600" />
                )}
                
                {/* Child Node */}
                <div className="
                  p-2 rounded-lg border border-gray-600 
                  bg-gray-700/50 text-gray-300 text-sm
                ">
                  {child}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}