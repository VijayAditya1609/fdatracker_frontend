import React, { useState, useEffect } from 'react';
import { auth } from '../services/auth';
import { useParams } from 'react-router-dom';
import {
  Download,
  ExternalLink,
  LayoutDashboard,
  FileText,
  CheckSquare,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import OverviewTab from '../components/form483/OverviewTab';
import ObservationsTab from '../components/form483/ObservationsTab';
import AnalyticsTab from '../components/form483/AnalyticsTab';
import ChecklistTab from '../components/form483/ChecklistTab';
import { api } from '../config/api';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { useNavigate } from 'react-router-dom';
import { Form483Response } from '../services/form483';
import ObservationAnalysisPage from './ObservationAnalysisPage';
import UpgradeMessage from '../components/form483/UpgradeMessage';
import { authFetch } from '../services/authFetch';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'observations', label: 'Observations', icon: FileText },
  { id: 'checklist', label: 'Audit Checklist', icon: CheckSquare },
];

export default function Form483DetailsPage() {
  useDocumentTitle('Form 483 Details');
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [form483Data, setForm483Data] = useState<Form483Response | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null); // Reset error state when starting a new request

        const response = await authFetch(`${api.form483Detail}?id=${id}`);

        if (response.status === 429) {
          setError('PAGE_VIEW_LIMIT_EXCEEDED');
          return;
        }

        if (!response.ok) {
          throw new Error('You have reached your daily limit. Please subscribe.');
        }

        const data = await response.json();
        setForm483Data(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'You have reached your daily limit. Please subscribe.'
        );
      } finally {
        setIsLoading(false);
      }
    };


    fetchData();
  }, [id]);

  // Update the error handling section
  // Show loading state while the request is in progress
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  // Only show the upgrade message if we have an actual error and we're not loading
  if (!isLoading && (error || (!form483Data && !isLoading))) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <UpgradeMessage />
        </div>
      </DashboardLayout>
    );
  }

  // Ensure we have data before rendering the main content
  if (!form483Data) {
    return null;
  }


  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap flex-col sm:flex-row sm:items-center sm:justify-between mb-0">
          <div className="flex items-center justify-between mb-8">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-400 hover:text-white mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Form 483s
              </button>
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold text-white">
                  Form 483 Details
                </h1>
                <span className="inline-flex items-center rounded-full bg-blue-400/10 px-3 py-1 text-sm font-medium text-blue-400">
                  {form483Data.form483Details.pdfId}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
          <button
  onClick={async () => {
    try {
      const path = form483Data.form483Details.url;
      console.log('Form 483 Path:', path);
      if (!path) {
        console.error('Path is missing');
        return;
      }
      const token = auth.getToken();
      console.log('Token being sent:', token);

      const response = await authFetch(`${api.viewFile}?path=${encodeURIComponent(path)}`);
      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error('Failed to fetch Form 483');
      }

      // Convert the response to a Blob (assuming it's a PDF)
      const blob = await response.blob();
      // Create an object URL from the blob
      const blobUrl = window.URL.createObjectURL(blob);
      // Open the URL in a new tab
      window.open(blobUrl, '_blank');
    } catch (error) {
      console.error('Error viewing Form 483:', error);
    }
  }}
  className="inline-flex items-center justify-center px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg border border-gray-600 font-medium transition-colors"
>
  <ExternalLink className="w-4 h-4 mr-2" />
  View Form 483
</button>


            {form483Data.form483Details.warningLetterId > 0 && (
              <button
                onClick={() => navigate(`/warning-letters/${form483Data.form483Details.warningLetterId}`)}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-medium transition-colors shadow-sm"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                View Warning Letter
              </button>
            )}

            <button
              onClick={async () => {
                try {
                  setIsDownloading(true);
                  const pdfId = form483Data.form483Details.pdfId; // Ensure pdfId is available
                  const url = `${api.AuditReadinessChecklistForm483}?pdfId=${encodeURIComponent(pdfId)}`;
                  const response = await authFetch(url, { method: 'GET' });

                  const blob = await response.blob();
                  const downloadUrl = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = downloadUrl;
                  link.download = `Form483_Checklist_${pdfId}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(downloadUrl);
                } catch (error) {
                  console.error('Error downloading Form 483 Checklist:', error);
                } finally {
                  setIsDownloading(false);
                }
              }}
              disabled={isDownloading}
              className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg 
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
          </div>
        </div>

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

        <div className="mt-6">
          {activeTab === 'overview' && <OverviewTab data={form483Data} />}
          {activeTab === 'observations' && (
            <ObservationsTab
              observations={form483Data.form483Details.keyObservations}
              pdfId={form483Data.form483Details.pdfId}
            />
          )}
          {activeTab === 'checklist' && (
            <ChecklistTab
              observations={form483Data.form483Details.keyObservations}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
