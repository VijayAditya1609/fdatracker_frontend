import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Form483Observation } from '../types/form483';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Activity, Wrench, AlertCircle, ArrowLeft } from 'lucide-react';
import ProcessAnalysis from '../components/form483/observation-detail/ProcessAnalysis';
import CorrectiveActions from '../components/form483/observation-detail/CorrectiveActions';
import { api } from '../config/api';
import { auth } from '../services/auth';
import { authFetch } from '../services/authFetch';

export default function ObservationAnalysisPage() {
  const { pdfId, observationId } = useParams<{ pdfId: string; observationId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [observations, setObservations] = useState<Form483Observation[]>([]);
  const [selectedObservation, setSelectedObservation] = useState<Form483Observation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectedButtonRef = useRef<HTMLButtonElement>(null);

  // Initialize activeProcessType safely
  const [activeProcessType, setActiveProcessType] = useState<string | null>(
    selectedObservation ? selectedObservation.process_types_affected[0]?.process_type || null : null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await authFetch(`${api.form483Detail}?id=${pdfId}`);
        if (!response.ok) throw new Error('Failed to load observations');
    
        const data = await response.json();
        setObservations(data.form483Details.keyObservations);
    
        const observation = data.form483Details.keyObservations.find(
          (obs: Form483Observation) => obs.id.toString() === observationId
        );
        if (observation) {
          setSelectedObservation(observation);
          setActiveProcessType(observation.process_types_affected[0]?.process_type || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load observations');
      } finally {
        setIsLoading(false);
      }
    };
    

    fetchData();
  }, [pdfId, observationId]);

  useEffect(() => {
    if (selectedButtonRef.current) {
      selectedButtonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [selectedObservation]);

  const handleBackClick = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(`/form-483s/${pdfId}`);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!selectedObservation) return <div>Observation not found</div>;

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="mb-1">
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Details
          </button>
          <h1 className="text-2xl font-semibold text-white mb-6">Observation Analysis</h1>

          {/* Horizontal observation tabs */}
          <div className="border-b border-gray-700 mb-6">
            <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
              {observations.map((observation) => (
                <button
                  key={observation.id}
                  ref={selectedObservation?.id === observation.id ? selectedButtonRef : null}
                  onClick={() => navigate(`/form-483s/${pdfId}/analysis/${observation.id}`)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${selectedObservation.id === observation.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                    }`}
                >
                  <AlertCircle className="h-5 w-5 mr-2 text-blue-400" />
                  <span>Observation {observation.observationNumber}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedObservation.process_types_affected.map((process) => (
            <button
              key={process.process_type}
              onClick={() => setActiveProcessType(process.process_type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${activeProcessType === process.process_type
                  ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20'
                  : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
                }`}
            >
              {process.process_type}
            </button>
          ))}
        </div>
        {/* Observation Analysis & Corrective Actions Section */}
        <div className="space-y-8">
          {/* Observation Analysis Section */}
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-400" /> Observation Analysis
            </h2>
            <ProcessAnalysis
              processTypes={selectedObservation.process_types_affected}
              activeProcessType={activeProcessType}
            />
          </div>

          {/* Corrective Actions Section */}
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-blue-400" /> Corrective Actions
            </h2>
            <CorrectiveActions
              processTypes={selectedObservation.process_types_affected}
              activeProcessType={activeProcessType}
            />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
