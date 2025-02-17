import React from 'react';
import { AlertTriangle, FileText, CheckCircle, Clock } from 'lucide-react';

interface RegulatoryTimelineProps {
  selectedCompanies: string[];
}

const timelineData = {
  'Novo Nordisk': [
    {
      date: '2024-03-15',
      type: 'Form 483',
      description: 'Minor observations in aseptic processing',
      status: 'Open',
      severity: 'Low'
    },
    {
      date: '2024-02-01',
      type: 'Warning Letter',
      description: 'Data integrity concerns addressed',
      status: 'Closed',
      severity: 'High'
    },
    {
      date: '2024-01-15',
      type: 'Inspection',
      description: 'Routine GMP inspection - NAI',
      status: 'Completed',
      severity: 'Low'
    }
  ],
  'Eli Lilly': [
    {
      date: '2024-03-10',
      type: 'Inspection',
      description: 'Pre-approval inspection - VAI',
      status: 'Completed',
      severity: 'Medium'
    },
    {
      date: '2024-02-15',
      type: 'Form 483',
      description: 'Laboratory controls observations',
      status: 'Closed',
      severity: 'Medium'
    }
  ],
  'Sanofi': [
    {
      date: '2024-03-20',
      type: 'Warning Letter',
      description: 'Cross-contamination concerns',
      status: 'Open',
      severity: 'High'
    },
    {
      date: '2024-02-28',
      type: 'Form 483',
      description: 'Equipment cleaning validation',
      status: 'In Progress',
      severity: 'Medium'
    },
    {
      date: '2024-01-30',
      type: 'Inspection',
      description: 'For-cause inspection - OAI',
      status: 'Completed',
      severity: 'High'
    }
  ],
  'AstraZeneca': [
    {
      date: '2024-03-05',
      type: 'Form 483',
      description: 'Documentation practices',
      status: 'Closed',
      severity: 'Low'
    },
    {
      date: '2024-02-10',
      type: 'Inspection',
      description: 'Routine GMP inspection - VAI',
      status: 'Completed',
      severity: 'Medium'
    }
  ]
};

const getEventIcon = (type: string) => {
  switch (type) {
    case 'Warning Letter':
      return AlertTriangle;
    case 'Form 483':
      return FileText;
    case 'Inspection':
      return Clock;
    default:
      return CheckCircle;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'bg-yellow-400/10 text-yellow-400';
    case 'closed':
      return 'bg-green-400/10 text-green-400';
    case 'in progress':
      return 'bg-blue-400/10 text-blue-400';
    case 'completed':
      return 'bg-green-400/10 text-green-400';
    default:
      return 'bg-gray-400/10 text-gray-400';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'high':
      return 'text-red-400';
    case 'medium':
      return 'text-yellow-400';
    case 'low':
      return 'text-green-400';
    default:
      return 'text-gray-400';
  }
};

export default function RegulatoryTimeline({ selectedCompanies }: RegulatoryTimelineProps) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Regulatory Timeline</h3>

      <div className="grid grid-cols-4 gap-6">
        {selectedCompanies.map((company) => {
          const events = timelineData[company];
          if (!events) return null;

          return (
            <div key={company} className="space-y-4">
              <h4 className="text-sm font-medium text-white">{company}</h4>
              
              <div className="relative space-y-6">
                <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-700" />
                
                {events.map((event, index) => {
                  const Icon = getEventIcon(event.type);
                  
                  return (
                    <div key={index} className="relative pl-10">
                      <div className="absolute left-0 p-2 bg-gray-800 rounded-full border border-gray-700">
                        <Icon className={`h-4 w-4 ${getSeverityColor(event.severity)}`} />
                      </div>
                      
                      <div className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">
                            {event.type}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-2">
                          {event.description}
                        </p>
                        
                        <div className="text-xs text-gray-500">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}