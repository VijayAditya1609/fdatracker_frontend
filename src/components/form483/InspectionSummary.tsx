import React from 'react';
import { Building2, MapPin, Calendar, Users, Clock } from 'lucide-react';

interface InspectionSummaryProps {
  facilityName: string;
  feiNumber: string;
  address: string;
  issueDate: string;
  inspectionDates: string[];
  investigators: string[];
}

export default function InspectionSummary({
  facilityName,
  feiNumber,
  address,
  issueDate,
  inspectionDates,
  investigators
}: InspectionSummaryProps) {
  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-gray-700 rounded-lg">
          <Building2 className="h-6 w-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{facilityName}</h2>
          <div className="flex items-center mt-1 text-sm text-gray-400">
            <MapPin className="h-4 w-4 mr-1.5" />
            {address}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-300">Issue Date</span>
            </div>
            <span className="text-sm font-medium text-white">{issueDate}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-300">Inspection Period</span>
            </div>
            <span className="text-sm font-medium text-white">
              {inspectionDates[0]} - {inspectionDates[1]}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-300">FEI Number</span>
            </div>
            <span className="text-sm font-medium text-white">{feiNumber}</span>
          </div>
          <div className="p-4 bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-300">Investigators</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {investigators.map((investigator, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-gray-700 px-2.5 py-1 text-xs font-medium text-gray-300"
                >
                  {investigator}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}