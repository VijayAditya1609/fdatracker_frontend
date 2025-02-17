import React, { useState } from 'react';
import { Building2, MapPin, Calendar, Activity, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { api } from '../../config/api';
import { authFetch } from '../../services/authFetch';
import InspectionModal from './InspectionModal';

interface InspectionCardProps {
  inspection: {
    inspectionid: string;
    feinumber: string;
    legalname: string;
    countryname: string;
    inspectionenddate: string;
    id: string;
    producttype: string;
    classificationcode: string;
  };
  onClick?: () => void;
}

export default function InspectionCard({ inspection, onClick }: InspectionCardProps) {
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [requestModalIsOpen, setRequestModalIsOpen] = useState(false);
  const [requestReason, setRequestReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCardClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  
    if (onClick) {
      onClick();
    }
  
    console.log(`Clicked on card with classification: ${inspection.classificationcode}`);
  
    if (inspection.classificationcode.trim().toUpperCase() === 'NAI') {
      console.log('NAI classification detected - Skipping servlet call and modal trigger');
      return;
    }
  
    try {
      const response = await authFetch(`${api.inspectionDetail}?inspectionId=${inspection.id}`);
      const data = await response.json();
  
      console.log('Received data from API:', data);
  
      if (data.id === -1) {
        console.log('Setting modal to open');
        setRequestModalIsOpen(true);
      } else {
        console.log(`Redirecting to /form-483s/${data.id}`);
        window.location.pathname = `/form-483s/${data.id}`;
      }
    } catch (error) {
      console.error('Error fetching inspection details:', error);
      alert('Error loading inspection details.');
    }
  };
  
  
  

  const handleRequestSubmit = async () => {
    // if (!requestReason.trim()) {
    //   alert('Please provide a reason for your request');
    //   return;
    // }
  
    setIsSubmitting(true);
    try {
      const response = await authFetch(`${api.form483Request}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inspectionId: inspection.inspectionid,
          companyName: inspection.legalname
        }),
      });
  
      if (response.ok) {
        alert('Your request has been submitted successfully. Our team will review it shortly.');
        setRequestModalIsOpen(false);
        setRequestReason('');
      } else {
        throw new Error('Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const getStatusIcon = (code: string) => {
    switch (code) {
      case 'NAI':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'VAI':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'OAI':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (code: string) => {
    switch (code) {
      case 'NAI':
        return 'text-green-400';
      case 'VAI':
        return 'text-yellow-400';
      case 'OAI':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl overflow-hidden cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="p-6 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gray-700/50 rounded-lg group-hover:bg-gray-700 transition-colors">
                <Building2 className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {inspection.legalname}
                </h3>
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1.5" />
                  <span className="text-sm text-gray-400">{inspection.countryname}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 group-hover:bg-gray-800 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-400">FEI Number</div>
                <Building2 className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-sm font-medium text-white">{inspection.feinumber}</div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4 group-hover:bg-gray-800 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-400">Product Type</div>
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-sm font-medium text-white">{inspection.producttype}</div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between">
            <div className="flex items-center text-gray-400">
              <Calendar className="h-4 w-4 mr-1.5" />
              {new Date(inspection.inspectionenddate).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(inspection.classificationcode)}
              <span className={`text-sm ${getStatusColor(inspection.classificationcode)}`}>
                {inspection.classificationcode}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for ID = -1 */}
      <InspectionModal 
        isOpen={modalIsOpen} 
        onRequestClose={() => setModalIsOpen(false)} 
        title="Inspection Not Found" 
        content="No valid inspection data found for this entry." 
      />
    </>
  );
}