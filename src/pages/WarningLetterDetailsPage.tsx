import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Activity, FileText, AlertTriangle, Target, Brain, ArrowLeft, Link as LinkIcon, Loader2 } from 'lucide-react';
import { WarningLetterResponse } from '../types/warningLetter';
import { api } from '../config/api';
import OverviewTab from '../components/warningLetter/OverviewTab';
import ViolationsTab from '../components/warningLetter/ViolationsTab';
import ComplianceHistoryTab from '../components/warningLetter/ComplianceHistoryTab';
import ResponseTrackingTab from '../components/warningLetter/ResponseTrackingTab';
import UpgradeMessage from '../components/warningLetter/UpgradeMessage';
import { auth } from '../services/auth';
import { authFetch } from '../services/authFetch';


const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'violations', label: 'Violations', icon: AlertTriangle },
];

export default function WarningLetterDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [warningLetterData, setWarningLetterData] = useState<WarningLetterResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
  
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
  
        const response = await authFetch(`${api.warningLetterDetail}?id=${id}`);
  
        if (response.status === 429) {
          setError('PAGE_VIEW_LIMIT_EXCEEDED');
          return;
        }
  
        const data = await response.json();
        setWarningLetterData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'You have reached your daily limit. Please subscribe.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [id]);
  

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
  if (!isLoading && (error || (!warningLetterData && !isLoading))) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <UpgradeMessage />
        </div>
      </DashboardLayout>
    );
  }

  // Ensure we have data before rendering
  if (!warningLetterData) {
    return null;
  }

  const { warningLetterDetails } = warningLetterData;

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-400 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Warning Letters
            </button>
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-2xl font-semibold text-white">Warning Letter Details</h1>
              <span className="inline-flex items-center rounded-full bg-red-400/10 px-3 py-1 text-sm font-medium text-red-400">
                {warningLetterDetails.documentType}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
            {warningLetterDetails.linked483Id && (
              <button
                onClick={() => navigate(`/form-483s/${warningLetterDetails.linked483Id}`)}
                className="inline-flex items-center px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Form 483 Overview
              </button>
            )}
            {warningLetterDetails.url && (
              <a 
                href={warningLetterDetails.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors text-sm sm:text-base w-full sm:w-auto">
                <LinkIcon className="w-4 h-4 mr-2" />
                View Letter
              </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
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
          {activeTab === 'overview' && <OverviewTab data={warningLetterData} />}
          {activeTab === 'violations' && (
            <ViolationsTab 
              violations={warningLetterDetails.violations} 
              warningLetterId={id || ''}
            />
          )}
          {activeTab === 'compliance-history' && <ComplianceHistoryTab />}
          {activeTab === 'response-tracking' && <ResponseTrackingTab />}
        </div>
      </div>
    </DashboardLayout>
  );
}