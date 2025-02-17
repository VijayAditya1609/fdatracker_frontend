import React from 'react';
import { Building2, MapPin, Activity, FileWarning, ArrowRight } from 'lucide-react';

interface FacilitiesTabProps {
  facilities: any[]; // Replace with proper type
}

export default function FacilitiesTab({ facilities }: FacilitiesTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facilities.map((facility, index) => (
          <div key={index} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-700 rounded-lg">
                  <Building2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white">{facility.name}</h4>
                  <div className="flex items-center mt-1 text-sm text-gray-400">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    {facility.location}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <Activity className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">{facility.form483Count}</span>
                </div>
                <p className="text-xs text-gray-400">Form 483s</p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <FileWarning className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">{facility.warningLetterCount}</span>
                </div>
                <p className="text-xs text-gray-400">Warning Letters</p>
              </div>
            </div>

            <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-600 transition-colors">
              View Facility Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}