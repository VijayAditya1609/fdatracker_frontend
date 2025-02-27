import React from 'react';
import { Building2, MapPin, FileText, Activity, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Facility } from '../../types/facility';
import ReactGA from "react-ga4";
import { trackEvent } from "../../utils/analytics";

interface FacilityCardProps {
  facility: Facility;
}

export default function FacilityCard({ facility }: FacilityCardProps) {
  const navigate = useNavigate();

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-red-400/10 text-red-400';
      case 'medium':
        return 'bg-yellow-400/10 text-yellow-400';
      default:
        return 'bg-green-400/10 text-green-400';
    }
  };

  const handleCardClick = () => {
    // ReactGA.event({
    //   category: "Facilities",
    //   action: "Item Click",
    //   label: `Facility Feinumber: ${facility.feiNumber} : ${facility.name}`
    // });
    trackEvent("Facilities", "Item Click", `Facility Feinumber: ${facility.feiNumber} : ${facility.name}`);

    navigate(`/facilities/${facility.feiNumber}`, {
      state: { facilityName: facility.name }
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl overflow-hidden cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="p-6 relative z-10">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-700/50 rounded-lg group-hover:bg-gray-700 transition-colors">
              <Building2 className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                {facility.name}
              </h3>
              <div className="flex items-center mt-1">
                <MapPin className="h-4 w-4 text-gray-400 mr-1.5" />
                <span className="text-sm text-gray-400 line-clamp-1">{facility.location}</span>
              </div>
            </div>
          </div>
       
        </div>

        {/* Business Operations */}
        <div className="mb-6">
          <span className="text-sm text-gray-400">Business Operations</span>
          <div className="mt-2">
            <span className="inline-flex items-center rounded-full bg-blue-400/10 px-2.5 py-1 text-xs font-medium text-blue-400">
              {facility.businessOperations}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4 group-hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-5 w-5 text-blue-400" />
              <span className="text-lg font-semibold text-white">{facility.count483}</span>
            </div>
            <p className="text-sm text-gray-400">Form 483s</p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 group-hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <span className="text-lg font-semibold text-white">{facility.countWL}</span>
            </div>
            <p className="text-sm text-gray-400">Warning Letters</p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 group-hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-purple-400" />
              <span className="text-lg font-semibold text-white">{facility.countInspections}</span>
            </div>
            <p className="text-sm text-gray-400">Inspections</p>
          </div>
        </div>

        {/* Process Types */}
        {facility.topProcessTypes && facility.topProcessTypes.length > 0 && (
          <div className="mt-6">
            <span className="text-sm text-gray-400">Top sub-systems</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {facility.topProcessTypes.map((type, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-gray-700 px-2.5 py-1 text-xs font-medium text-gray-300"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Building2 className="h-4 w-4 mr-1.5" />
              FEI: {facility.feiNumber}
            </div>
            <div className="flex items-center">
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}