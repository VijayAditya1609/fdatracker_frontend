import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Activity, FileText, BarChart2, ArrowLeft, Loader2, FileWarning, AlertTriangle, ClipboardCheck, Download } from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import InspectionHistory from '../components/facilities/detail/InspectionHistory';
import TopInvestigators from '../components/facilities/detail/TopInvestigators';
import SubsystemsGrid from '../components/facilities/detail/SubsystemsGrid';
import DocumentsList from '../components/facilities/detail/DocumentsList';
import { getFacilityTopInvestigators, getFacilityChartData, getFacilitySubsystems, getFacilityForm483AndWL, ChartData, FacilityStats, TopInvestigator } from '../services/facility';
import Alert from '../components/common/Alert';
import UpgradeMessage from '../components/form483/UpgradeMessage';
import { api } from '../config/api';
import { authFetch } from '../services/authFetch';

interface FacilityData {
  topInvestigators: TopInvestigator[];
  stats: FacilityStats;
  chartData: ChartData[];
  subsystems: Record<string, number>;
  form483AndWL: {
    facilitiesInspectionsList483: any[];
    facilitiesInspectionsListWl: any[];
    facilityName?: string;
  };
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'inspections', label: 'Inspections', icon: FileText },
  { id: 'subsystems', label: 'Subsystems', icon: BarChart2 }
] as const;

export default function FacilityDetailPage() {
  const { feinumber } = useParams<{ feinumber: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const facilityName = location.state?.facilityName || 'Facility Details';

  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [facilityData, setFacilityData] = useState<FacilityData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFacilityData() {
      if (!feinumber) {
        setError('You have reached your daily limit. Please subscribe.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null); // Reset error state when starting a new request

      try {
        const [facilityDetail, charts, subs, docs] = await Promise.all([
          getFacilityTopInvestigators(feinumber),
          getFacilityChartData(feinumber),
          getFacilitySubsystems(feinumber),
          getFacilityForm483AndWL(feinumber)
        ]);

        if (!facilityDetail || !charts || !subs || !docs) {
          throw new Error('You have reached your daily limit. Please subscribe.');
        }

        // Ensure facilitiesInspectionsListWl exists
        if (!docs.facilitiesInspectionsListWl) {
          docs.facilitiesInspectionsListWl = [];
        }

        setFacilityData({
          topInvestigators: facilityDetail.topInvestigators,
          stats: facilityDetail.stats,
          chartData: charts,
          subsystems: subs,
          form483AndWL: docs
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'You have reached your daily limit. Please subscribe.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadFacilityData();
  }, [feinumber]);

  const handleDownloadChecklist = async () => {
    if (!feinumber || !facilityName) return;

    try {
      setIsDownloading(true);
      setDownloadError(null);
      const encodedFacilityName = encodeURIComponent(facilityName);
      const url = `${api.AuditReadinessCheckListForFacility}?feinumber=${feinumber}&facilityName=${encodedFacilityName}`;

      const response = await authFetch(url, { method: 'GET' });


      if (response.status === 429) {
        setError('You have reached your daily limit. Please subscribe.');
        return;
      }

      if (response.status === 404) {
        setDownloadError('No audit checklist available for this facility');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to download checklist');
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        setDownloadError('No audit checklist available for this facility');
        return;
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${facilityName}_Audit_Checklist.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      setDownloadError('Failed to download audit checklist');
    } finally {
      setIsDownloading(false);
    }
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
  if (!isLoading && (error || (!facilityData && !isLoading))) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <UpgradeMessage />
        </div>
      </DashboardLayout>
    );
  }

  // Ensure we have data before rendering
  if (!facilityData) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-400 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Facilities
            </button>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold text-white">
                {facilityName}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">FEI Number:</span>
                <span className="inline-flex items-center rounded-full bg-blue-400/10 px-3 py-1 text-sm font-medium text-blue-400">
                  {feinumber}
                </span>
              </div>
            </div>
          </div>

          {/* Download Button and Error Message */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-0">
            <button
              onClick={handleDownloadChecklist}
              disabled={isDownloading}
              className={`flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg 
      transition-colors ${isDownloading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-600'}`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Audit Checklist
                </>
              )}
            </button>
            {downloadError && (
              <div className="w-full sm:w-auto">
                <Alert
                  type="warning"
                  message={downloadError}
                  onClose={() => setDownloadError(null)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                  ${activeTab === id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <InspectionHistory
                chartData={facilityData.chartData}
                stats={facilityData.stats}
              />
              <TopInvestigators investigators={facilityData.topInvestigators} />
            </div>
          )}

          {activeTab === 'inspections' && (
            <DocumentsList documents={facilityData.form483AndWL} />
          )}

          {activeTab === 'subsystems' && (
            <SubsystemsGrid subsystems={facilityData.subsystems} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}