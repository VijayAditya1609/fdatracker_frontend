import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Activity, FileText, AlertCircle, Target, Brain, ArrowLeft } from 'lucide-react';
import ObservationOverview from '../components/form483/observation-detail/ObservationOverview';
import ProcessAnalysis from '../components/form483/observation-detail/ProcessAnalysis';
import CorrectiveActions from '../components/form483/observation-detail/CorrectiveActions';
import { Form483Observation } from '../types/form483';
import { getObservationDetails } from '../services/observation';
import Alert from '../components/common/Alert';


const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'process-analysis', label: 'Sub-system Analysis', icon: Target },
  { id: 'corrective-actions', label: 'Corrective Actions', icon: FileText }
];

export default function ObservationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [observation, setObservation] = useState<Form483Observation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchObservation = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const data = await getObservationDetails(id);
        setObservation(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load observation details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchObservation();
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-400">Loading observation details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !observation) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Form 483
          </button>
          <Alert 
            type="error"
            message={error || 'Failed to load observation details'}
          />
        </div>
      </DashboardLayout>
    );
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
              Back to Form 483
            </button>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-white">
                Observation {observation.observationNumber}
              </h1>
              {observation.isEscalated && (
                <span className="inline-flex items-center rounded-full bg-red-400/10 px-3 py-1 text-sm font-medium text-red-400">
                  Escalated
                </span>
              )}
            </div>
            <p className="mt-2 text-gray-400">{observation.observation_summary}</p>
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
        <div className="mt-8">
          {activeTab === 'overview' && <ObservationOverview observation={observation} />}
          {/* {activeTab === 'process-analysis' && (
            // <ProcessAnalysis processTypes={observation.process_types_affected} />
          )}
          {activeTab === 'corrective-actions' && (
            // <CorrectiveActions processTypes={observation.process_types_affected} />
          )} */}
        </div>
      </div>
    </DashboardLayout>
  );
}