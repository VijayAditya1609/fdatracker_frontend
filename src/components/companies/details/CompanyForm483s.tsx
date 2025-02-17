import React, { useState, useEffect } from 'react';
import { FileText, MapPin, Clock, Download } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../config/api';
import { authFetch } from '../../../services/authFetch';

interface Inspection {
  company_affected: string;
  inspection_dates: string;
  feinumber: string;
  issue_date: string;
  pdf_id: string;
  url?: string;
  producttype: string;
}

export default function CompanyForm483s() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        setLoading(true);
        const response = await authFetch(`${api.companyInspections}?companyId=${id}`);
        const data = await response.json();
        setInspections(data.companyInspectionsList || []);
      } catch (err) {
        setError('Failed to load inspection data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInspections();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Loading inspections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!inspections.length) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white">No Form 483s Found</h3>
        <p className="mt-2 text-gray-400">This company has no Form 483 observations.</p>
      </div>
    );
  }

  const parseInspectionDates = (datesString: string) => {
    try {
      const dates = JSON.parse(datesString);
      return dates.length > 0
        ? {
          startDate: new Date(dates[0]).toLocaleDateString(),
          endDate: new Date(dates[dates.length - 1]).toLocaleDateString(),
        }
        : null;
    } catch {
      return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {inspections.map((inspection) => {
        const inspectionDates = parseInspectionDates(inspection.inspection_dates);

        return (
          <div
            key={inspection.pdf_id}
            className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/30 cursor-pointer"
            onClick={() => navigate(`/form-483s/${inspection.pdf_id}`)} // Navigate to the specific Form 483 page
          >
            {/* Header Section */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gray-700 rounded-lg shrink-0">
                <FileText className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">
                  {inspection.company_affected}
                </h3>
                <div className="mt-1 flex flex-wrap gap-3">
                  <span className="inline-flex items-center text-sm text-gray-400">
                    <Clock className="h-4 w-4 mr-1.5" />
                    {new Date(inspection.issue_date).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center text-sm text-gray-400">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    FEI: {inspection.feinumber}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="mt-6 space-y-6">
              {/* Inspection Details */}
              <div className="rounded-lg bg-gray-700/30 p-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Inspection Details</h4>
                <div className="space-y-3">
                  {inspectionDates && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Duration</span>
                      <span className="text-sm text-gray-300 font-medium">
                        {inspectionDates.startDate} - {inspectionDates.endDate}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Product Type</span>
                    <span className="inline-flex items-center rounded-full bg-purple-400/10 px-3 py-1 text-sm font-medium text-purple-400">
                      {inspection.producttype}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Form 483 ID</span>
                    <span className="text-sm text-gray-300 font-medium">{inspection.pdf_id}</span>
                  </div>
                </div>
              </div>
         
            </div>
            {/* View Button */}

          </div>

        );
      })}
    </div>
  );
}
