import React, { useState, useEffect } from 'react';
import {useNavigate, useParams, useLocation } from 'react-router-dom';
import { Activity, FileText, AlertTriangle, BarChart2, Loader2, AlertCircle, CheckSquare, Calendar, ArrowLeft } from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import SystemOverview from '../components/systems/detail/SubsystemOverview';
import Form483List from '../components/systems/detail/Form483List';
import ObservationsList from '../components/systems/detail/ObservationsList';
import ProcessChecklist from '../components/systems/detail/ProcessChecklist';
import TabNavigation from '../components/common/TabNavigation';
import { getSubSystemReport } from '../services/systems';
import type { SubSystemReport } from '../types/system';
import UpgradeMessage from '../components/systems/UpgradeMessage';

const tabs = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'form483s', label: 'Form 483s', icon: FileText },
  { id: 'observations', label: 'Observations', icon: AlertCircle },
  { id: 'checklist', label: 'Audit Checklist', icon: CheckSquare }
];

const systemNames: { [key: string]: string } = {
  'quality': 'Quality System',
  'laboratory': 'Laboratory Control System',
  'production': 'Production System',
  'facilities': 'Facilities & Equipment System',
  'materials': 'Materials System',
  'packaging': 'Packaging & Labeling System'
};

const dateRangeOptions = [
  { value: '90days', label: 'Last 3 Months' },
  { value: '180days', label: 'Last 6 Months' },
  { value: '365days', label: 'Last 12 Months' },
  { value: 'all', label: 'Since 2018' },
];

export default function SubsystemDetailPage() {
  const { system_id, subsystem_id } = useParams<{ system_id: string; subsystem_id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [subSystemData, setSubSystemData] = useState<SubSystemReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('365days');

  useEffect(() => {
    const fetchSubSystemData = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset error state when starting a new request
        
        const data = await getSubSystemReport(subsystem_id as string, dateRange);
        
        if (!data) {
          throw new Error('You have reached your daily limit. Please subscribe.');
        }
        
        setSubSystemData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'You have reached your daily limit. Please subscribe.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (subsystem_id) {
      fetchSubSystemData();
    }
  }, [subsystem_id, dateRange]);

  const handleBack = () => {
    navigate(-1);
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
  if (!isLoading && (error || (!subSystemData && !isLoading))) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <UpgradeMessage />
        </div>
      </DashboardLayout>
    );
  }

  // Ensure we have data before rendering
  if (!subSystemData) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="px-8 py-6">
        <button
          onClick={handleBack}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to System Overview
        </button>
        
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">{subsystem_id}</h1>
            <p className="text-gray-400 mt-1">Detailed analysis and metrics</p>
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

        <div className="mt-8">
          {activeTab === 'overview' && (
            <SystemOverview 
              subSystemData={subSystemData}
              subSystemName={subsystem_id || ''} 
              dateRange={dateRange}
            />
          )}
          {activeTab === 'form483s' && (
            <Form483List form483s={subSystemData.Form483s} />
          )}
          {activeTab === 'observations' && (
            <ObservationsList observations={subSystemData.observationList} />
          )}
          {activeTab === 'checklist' && (
            <ProcessChecklist 
              checklist={subSystemData.processTypesCheckList} 
              processType={subsystem_id || ''}
              dateRange={dateRange}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}