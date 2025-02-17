import React from 'react';
import { Building2, MapPin } from 'lucide-react';

interface FacilityInfoCardProps {
  facilityName: string;
  address: string;
  metrics: Array<{
    label: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  investigators?: string[];
}

export default function FacilityInfoCard({ 
  facilityName, 
  address, 
  metrics,
  investigators 
}: FacilityInfoCardProps) {
  return (
    <div className="col-span-2 bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Building2 className="h-8 w-8 text-blue-400" />
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-white">{facilityName}</h2>
            <div className="flex items-center mt-1 text-sm text-gray-400">
              <MapPin className="h-4 w-4 mr-1" />
              {address}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">{metric.label}</div>
              <metric.icon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="mt-2 text-lg font-semibold text-white">{metric.value}</div>
          </div>
        ))}
      </div>

      {investigators && investigators.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Investigators</h3>
          <div className="flex flex-wrap gap-2">
            {investigators.map((investigator, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-gray-700 px-3 py-1 text-sm text-gray-300"
              >
                {investigator}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}