import React from 'react';

interface ObservationTimelineProps {
  observations: any[]; // Replace with proper type
}

export default function ObservationTimeline({ observations }: ObservationTimelineProps) {
  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-700" />
      <div className="space-y-6">
        {observations?.map((observation, index) => (
          <div key={index} className="relative pl-10">
            <div className="absolute left-0 top-2 w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-300">{index + 1}</span>
            </div>
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
              <div className="text-sm text-gray-400">{observation.date}</div>
              <div className="mt-2 text-white">{observation.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}