import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Activity, FileText, Users, ArrowLeft, Loader2 } from 'lucide-react';
import TabNavigation from '../components/common/TabNavigation';
import OverviewTab from '../components/investigators/detail/OverviewTab';
import SubsystemsTab from '../components/investigators/detail/SubsystemsTab';
import Form483sTab from '../components/investigators/detail/Form483sTab';
import CoInvestigatorsTab from '../components/investigators/detail/CoInvestigatorsTab';
import { getInvestigatorDetail, getInvestigatorOverview, getInvestigatorSubsystems } from '../services/investigators';
import useDocumentTitle from '../hooks/useDocumentTitle';
import UpgradeMessage from '../components/investigators/UpgradeMessage';


const tabs = [  
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'subsystems', label: 'Subsystems', icon: Activity },
  { id: 'form483s', label: 'Form 483s', icon: FileText },
  { id: 'co-investigators', label: 'Co-Investigators', icon: Users }
];

export default function InvestigatorDetailPage() {
  useDocumentTitle('Investigator Details');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [investigator, setInvestigator] = useState<any>(null);
  const [overview, setOverview] = useState<any>(null);
  const [subsystems, setSubsystems] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset error state when starting a new request

        const investigatorData = await getInvestigatorDetail(id as string);
        
        if (!investigatorData) {
          throw new Error('You have reached your daily limit. Please subscribe.');
        }
        
        setInvestigator(investigatorData);

        const [overviewData, subsystemsData] = await Promise.all([
          getInvestigatorOverview(id as string).catch(err => {
            console.error('Overview fetch failed:', err);
            return null;
          }),
          getInvestigatorSubsystems(id as string).catch(err => {
            console.error('Subsystems fetch failed:', err);
            return null;
          })
        ]);
        
        setOverview(overviewData);
        setSubsystems(subsystemsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'You have reached your daily limit. Please subscribe.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
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
  if (!isLoading && (error || (!investigator && !isLoading))) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <UpgradeMessage />
        </div>
      </DashboardLayout>
    );
  }

  // Ensure we have data before rendering
  if (!investigator) {
    return null;
  }

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
              Back to Investigators
            </button>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-700 rounded-lg">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white">
                  {investigator.investigatorName}
                </h1>
                <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                  ${investigator.activityStatus === 'Active' ? 'bg-green-400/10 text-green-400' : 'bg-gray-400/10 text-gray-400'}`}>
                  {investigator.activityStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'overview' && (
            overview ? (
              <OverviewTab investigator={overview} />
            ) : (
              <div className="text-gray-400 text-center py-4">
                No overview data available
              </div>
            )
          )}
          {activeTab === 'subsystems' && <SubsystemsTab processTypesCount={subsystems?.processTypesCount} />}
          {activeTab === 'form483s' && <Form483sTab investigatorId={id as string} />}
          {activeTab === 'co-investigators' && <CoInvestigatorsTab investigatorId={id as string} />}
        </div>
      </div>
    </DashboardLayout>
  );
}