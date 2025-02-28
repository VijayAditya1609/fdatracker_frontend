import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Violation } from '../types/warningLetter';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Activity, AlertCircle, ArrowLeft, Wrench } from 'lucide-react';
import ProcessAnalysis from '../components/warningLetter/violation-detail/ProcessAnalysis';
import CorrectiveActions from '../components/warningLetter/violation-detail/CorrectiveActions';
import { api } from '../config/api';
import { auth } from '../services/auth';
import { authFetch } from '../services/authFetch';

export default function ViolationAnalysisPage() {
  const { warningLetterId, violationId } = useParams<{ warningLetterId: string; violationId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [violations, setViolations] = useState<Violation[]>([]);
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [activeProcessType, setActiveProcessType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('subsystem');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const selectedButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await authFetch(`${api.warningLetterDetail}?id=${warningLetterId}`);

        if (!response.ok) throw new Error('Failed to load violations');

        const data = await response.json();
        setViolations(data.warningLetterDetails.violations);

        const violation = data.warningLetterDetails.violations.find(
          (vio: Violation) => vio.id.toString() === violationId
        );
        if (violation) {
          setSelectedViolation(violation);
          setActiveProcessType(violation.process_types_affected[0]?.processType || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load violations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [warningLetterId, violationId]);

  useEffect(() => {
    if (selectedButtonRef.current) {
      selectedButtonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [selectedViolation]);

  const handleBackClick = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(`/warning-letters/${warningLetterId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 h-screen flex items-center justify-center">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;
  if (!selectedViolation) return <div>Violation not found</div>;

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Warning Letter
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-white">Violation Analysis</h1>
            <span className="inline-flex items-center rounded-full bg-yellow-400/10 px-2.5 py-1 text-xs font-medium text-yellow-400">
              {selectedViolation.cfrCode}
            </span>
          </div>
        </div>

        {/* Tabs for Violations */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {violations.map((violation) => (
              <button
                key={violation.id}
                onClick={() => navigate(`/warning-letters/${warningLetterId}/analysis/${violation.id}`)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  selectedViolation.id === violation.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                <AlertCircle className="h-5 w-5 mr-2 text-blue-400" />
                <span>Violation {violation.violationNumber}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Single Process Type Selection for Both Sections */}
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedViolation.process_types_affected.map((process) => (
            <button
              key={process.processType}
              onClick={() => setActiveProcessType(process.processType)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeProcessType === process.processType
                  ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20'
                  : 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
              }`}
            >
              {process.processType}
            </button>
          ))}
        </div>

        {/* Violation Analysis & Corrective Actions Section */}
        <div className="space-y-8">
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-400" /> Violation Analysis
            </h2>
            <ProcessAnalysis processTypes={selectedViolation.process_types_affected} activeProcessType={activeProcessType} />
          </div>

          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-blue-400" /> Corrective Actions
            </h2>
            <CorrectiveActions processTypes={selectedViolation.process_types_affected} activeProcessType={activeProcessType} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
