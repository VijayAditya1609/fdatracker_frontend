import React from 'react';
import { BarChart3 } from 'lucide-react';

const TopIssues: React.FC = () => {
  const mockIssues = [
    { id: 1, issue: 'Inadequate Documentation Control', count: 45, percentage: 18 },
    { id: 2, issue: 'Laboratory Data Integrity', count: 38, percentage: 15 },
    { id: 3, issue: 'Equipment Maintenance Records', count: 32, percentage: 13 },
    { id: 4, issue: 'CAPA Management', count: 28, percentage: 11 },
    { id: 5, issue: 'Training Documentation', count: 25, percentage: 10 }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="text-blue-400" />
        <h3 className="text-xl font-semibold text-white">Top Issues</h3>
      </div>
      <div className="space-y-4">
        {mockIssues.map(issue => (
          <div key={issue.id} className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">{issue.issue}</span>
              <span className="text-sm text-gray-400">{issue.count} instances</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div
                className="bg-blue-400 h-2 rounded-full"
                style={{ width: `${issue.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopIssues;