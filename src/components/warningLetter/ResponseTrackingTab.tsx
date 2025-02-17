import React from 'react';
import { Clock, CheckCircle, AlertTriangle, FileText, Send, MessageSquare } from 'lucide-react';

const responseTimeline = [
  {
    id: 1,
    type: 'warning-letter',
    title: 'Warning Letter Issued',
    date: '2024-03-01',
    status: 'Completed',
    description: 'FDA issues Warning Letter WL-2024-001'
  },
  {
    id: 2,
    type: 'response-draft',
    title: 'Initial Response Draft',
    date: '2024-03-10',
    status: 'Completed',
    description: 'First draft of response completed by Quality team'
  },
  {
    id: 3,
    type: 'review',
    title: 'Legal Review',
    date: '2024-03-15',
    status: 'In Progress',
    description: 'Response under review by Legal department'
  },
  {
    id: 4,
    type: 'submission',
    title: 'Response Submission',
    date: '2024-03-21',
    status: 'Pending',
    description: 'Deadline for response submission to FDA'
  }
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-400/10 text-green-400';
    case 'in progress':
      return 'bg-yellow-400/10 text-yellow-400';
    default:
      return 'bg-gray-400/10 text-gray-400';
  }
};

const getStatusIcon = (type: string) => {
  switch (type) {
    case 'warning-letter':
      return AlertTriangle;
    case 'response-draft':
      return FileText;
    case 'review':
      return MessageSquare;
    case 'submission':
      return Send;
    default:
      return Clock;
  }
};

export default function ResponseTrackingTab() {
  return (
    <div className="space-y-6">
      {/* Response Status Card */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Response Status</h3>
            <p className="mt-1 text-sm text-gray-400">
              Track the progress of Warning Letter response
            </p>
          </div>
          <span className="inline-flex items-center rounded-full bg-yellow-400/10 px-3 py-1 text-sm font-medium text-yellow-400">
            In Progress
          </span>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-between">
              {['Draft', 'Review', 'Approval', 'Submission'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className="bg-gray-800 px-2">
                    <div className={`w-4 h-4 rounded-full ${
                      index === 1 ? 'bg-yellow-400' : 
                      index < 1 ? 'bg-green-400' : 
                      'bg-gray-600'
                    }`} />
                  </div>
                  <div className="text-xs text-gray-400 mt-2">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Response Timeline</h3>
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-gray-700" />
          <div className="space-y-8">
            {responseTimeline.map((event) => {
              const StatusIcon = getStatusIcon(event.type);
              return (
                <div key={event.id} className="relative flex items-start">
                  <div className="absolute left-0 rounded-full bg-gray-800 p-2 border border-gray-700">
                    <StatusIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-16">
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium text-white">{event.title}</h4>
                      <span className={`ml-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-400">{event.description}</p>
                    <time className="mt-1 text-xs text-gray-500">{event.date}</time>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-white hover:bg-gray-700">
          <FileText className="h-4 w-4 mr-2" />
          View Draft Response
        </button>
        <button className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700">
          <Send className="h-4 w-4 mr-2" />
          Submit Response
        </button>
      </div>
    </div>
  );
}