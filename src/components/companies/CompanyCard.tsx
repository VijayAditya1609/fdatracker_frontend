import React from 'react';
import { Building2, FileWarning, Activity, FileText, Factory, CheckCircle } from 'lucide-react';
import { Company } from '../../types/company';
import { useNavigate } from 'react-router-dom';

interface CompanyCardProps {
  company: Company;
  onClick: () => void;
}

export default function CompanyCard({ company, onClick }: CompanyCardProps) {

  const handleClick = () => {
    navigate(`/companies/${company.id}`, {
      state: { company }
    });
  };
  const navigate = useNavigate();
  return (
    <div
      onClick={handleClick}
      className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl overflow-hidden cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="p-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-700/50 rounded-lg group-hover:bg-gray-700 transition-colors">
              <Building2 className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                {company.company_name}
              </h3>
              <div className="flex items-center mt-1">
                <Factory className="h-4 w-4 text-gray-400 mr-1.5" />
                <span className="text-sm text-gray-400">
                  {company.active_facilities} Active {parseInt(company.active_facilities) === 1 ? 'Facility' : 'Facilities'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="gap-4 grid grid-cols-1 md:grid-cols-3">

        <div className="bg-gray-800/50 rounded-lg p-4 group-hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-5 w-5 text-purple-400" />
              <span className={`text-lg font-semibold ${parseInt(company.count_483) > 0 ? 'text-purple-400' : 'text-gray-400'}`}>
                {company.count_483}
              </span>
            </div>
            <p className="text-sm text-gray-400">Form 483s</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4 group-hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <FileWarning className="h-5 w-5 text-yellow-400" />
              <span className={`text-lg font-semibold ${parseInt(company.count_wl) > 0 ? 'text-yellow-400' : 'text-gray-400'}`}>
                {company.count_wl}
              </span>
            </div>
            <p className="text-sm text-gray-400">Warning Letters</p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 group-hover:bg-gray-800 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-5 w-5 text-blue-400" />
              <span className={`text-lg font-semibold ${parseInt(company.count_inspections) > 0 ? 'text-blue-400' : 'text-gray-400'}`}>
                {company.count_inspections}
              </span>
            </div>
            <p className="text-sm text-gray-400">Inspections</p>
          </div>
        </div>

        {/* Compliance Status */}
        {/* <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Compliance Status</span>
            </div>
            <span className="inline-flex items-center rounded-full bg-green-400/10 px-2.5 py-1 text-xs font-medium text-green-400">
              Good Standing
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );
}