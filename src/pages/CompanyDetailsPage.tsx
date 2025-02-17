import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import CompanyOverview from '../components/companies/details/CompanyOverview';
import CompanyFacilities from '../components/companies/details/CompanyFacilities';
import CompanyForm483s from '../components/companies/details/CompanyForm483s';
import { Building2, MapPin, Globe, FileText, ArrowLeft } from 'lucide-react';

interface LocationState {
  company?: {
    company_name: string;
    id: string;
    // ... other company properties
  };
}

export default function CompanyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const location = useLocation();
  const { company } = location.state as LocationState || {};
  const [companyName, setCompanyName] = useState<string>(company?.company_name || '');
  const navigate = useNavigate();

  useEffect(() => {
    if (!company && id) {
      // Fetch company data using the ID
      // Example:
      // fetchCompanyData(id).then(data => setCompanyName(data.company_name));
    }
  }, [id, company]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'facilities', label: 'Facilities', icon: MapPin },
    { id: 'form483s', label: 'Form 483s', icon: FileText }
  ];


  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-400 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Compnaies

            </button>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-white">
                {companyName || 'Loading...'}
              </h1>
              <span className="inline-flex items-center rounded-full bg-blue-400/10 px-3 py-1 text-sm font-medium text-blue-400">
                {id}
              </span>
            </div>

          </div>
        </div>
        {/* Tabs */}
        <div className="mt-2 border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'overview' && <CompanyOverview />}
          {activeTab === 'facilities' && <CompanyFacilities />}
          {activeTab === 'form483s' && <CompanyForm483s />}
        </div>
      </div>
    </DashboardLayout>
  );
}