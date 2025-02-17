import React from 'react';

interface ResponseTrackerProps {
  response: any; // Replace with proper type
}

export default function ResponseTracker({ response }: ResponseTrackerProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-400">Response Status</div>
          <span className="inline-flex items-center rounded-full bg-yellow-400/10 px-2.5 py-1 text-xs font-medium text-yellow-400">
            In Progress
          </span>
        </div>
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-between">
              {['Drafted', 'Submitted', 'Reviewed', 'Approved'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className="bg-gray-800 px-2">
                    <div className={`w-4 h-4 rounded-full ${
                      index === 1 ? 'bg-yellow-400' : index < 1 ? 'bg-green-400' : 'bg-gray-600'
                    }`} />
                  </div>
                  <div className="text-xs text-gray-400 mt-2">{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}