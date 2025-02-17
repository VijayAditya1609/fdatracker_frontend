import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { BarChart2, ListFilter, Loader2, ArrowLeft, Calendar } from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import TabNavigation from '../components/common/TabNavigation';
import { getSystemReport } from '../services/systems';
import type { SystemReport } from '../types/system';
import SystemOverviewTab from '../components/systems/detail/SystemOverviewTab';
import SubsystemsListTab from '../components/systems/detail/SubsystemsListTab';
import UpgradeMessage from '../components/systems/UpgradeMessage';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'subsystems', label: 'Subsystems', icon: ListFilter },
];

const systemNames: { [key: string]: { name: string; description: string } } = {
  'quality': {
    name: 'Quality System',
    description: 'Comprehensive overview of the Quality Management System and its components'
  },
  'laboratory': {
    name: 'Laboratory Control System',
    description: 'Management and oversight of laboratory operations and testing procedures'
  },
  'production': {
    name: 'Production System',
    description: 'Manufacturing processes, controls, and production management'
  },
  'facilities': {
    name: 'Facilities & Equipment System',
    description: 'Maintenance and management of facilities and equipment'
  },
  'materials': {
    name: 'Materials System',
    description: 'Material handling, storage, and inventory management'
  },
  'packaging': {
    name: 'Packaging & Labeling System',
    description: 'Control and oversight of packaging and labeling operations'
  },
  'IT': {
    name: 'IT/Data Management',
    description: 'IT infrastructure, systems, and security'
  }
};

const systemIdMapping: { [key: string]: string } = {
  '1': 'quality',
  '4': 'laboratory',
  '2': 'production',
  '3': 'facilities',
  '5': 'materials',
  '6': 'packaging',
  '7': 'IT',
};

const dateRangeOptions = [
  { value: '90days', label: 'Last 3 Months' },
  { value: '180days', label: 'Last 6 Months' },
  { value: '365days', label: 'Last 12 Months' },
  { value: 'all', label: 'Since 2018' }
];

export default function SystemDetailPage() {
  const { system_id } = useParams<{ system_id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [systemReport, setSystemReport] = useState<SystemReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('365days');

  const getSystemInfo = (id: string) => {
    if (!id) return null;
    const systemKey = systemIdMapping[id];
    return systemNames[systemKey] || null;
  };

  const systemInfo = useMemo(() => {
    const info = getSystemInfo(system_id || '');
    return info || {
      name: 'Unknown System',
      description: 'System analysis and metrics'
    };
  }, [system_id]);

  useEffect(() => {
    const fetchSystemReport = async () => {
      if (!system_id) return;
      
      try {
        setIsLoading(true);
        setError(null); // Reset error state when starting a new request
        
        const data = await getSystemReport(system_id, dateRange);
        
        if (!data) {
          throw new Error('You have reached your daily limit. Please subscribe.');
        }
        
        setSystemReport(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'You have reached your daily limit. Please subscribe.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemReport();
  }, [system_id, dateRange]);

  const handleSubsystemClick = (subsystemId: string) => {
    navigate(`/systems/${system_id}/subsystems/${subsystemId}`, {
      state: { systemInfo: systemInfo }
    });
  };

  // Show loading spinner while the request is in progress
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  // Show upgrade modal if we have an error or no data after loading
  if (!isLoading && (error || (!systemReport && !isLoading))) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <UpgradeMessage />
        </div>
      </DashboardLayout>
    );
  }

  // Ensure we have data before rendering
  if (!systemReport) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="px-8 py-6">
        <div className="space-y-6">
          {/* Back Button and Title Section */}
          <div className="flex justify-between items-start">
            <div>
              <button
                onClick={() => navigate('/sixSystems')}
                className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Systems
              </button>
              <div className="mb-4">
                <h1 className="text-2xl font-semibold text-white">
                  {systemInfo.name}
                </h1>
                <p className="text-gray-400 mt-1">{systemInfo.description}</p>
              </div>
            </div>

            {/* Date Range Selector */}
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-10 
                       text-gray-200 focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[160px]"
              >
                {dateRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>
          </div>
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="mt-4">
            {activeTab === 'overview' && (
              <SystemOverviewTab
                systemReport={systemReport}
                dateRange={dateRange}
              />
            )}
            {activeTab === 'subsystems' && (
              <SubsystemsListTab
                systemReport={systemReport}
                onSubsystemClick={handleSubsystemClick}
                dateRange={dateRange}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}