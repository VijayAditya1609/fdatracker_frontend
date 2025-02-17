import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Calendar, FileText, Package, ArrowRight, Loader2 } from 'lucide-react';
import { getInvestigatorInspections } from '../../../services/investigators';

interface Form483 {
  company_affected: string;
  inspection_dates: string;
  feinumber: string;
  issue_date: string;
  pdf_id: string;
  producttype: string;
  url?: string;
}

interface Form483sTabProps {
  investigatorId: string;
}

export default function Form483sTab({ investigatorId }: Form483sTabProps) {
  const [form483s, setForm483s] = useState<Form483[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForm483s = async () => {
      try {
        setIsLoading(true);
        const response = await getInvestigatorInspections(investigatorId, 'all');
        // Check if the response has the expected structure
        if (response?.investigatorsInspectionsList) {
          setForm483s(response.investigatorsInspectionsList);
        } else {
          setForm483s([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Form 483s');
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm483s();
  }, [investigatorId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-12">
        {error}
      </div>
    );
  }

  if (!form483s || form483s.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        No Form 483s found for this investigator.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {form483s.map((form483, index) => {
        // Parse inspection dates from JSON string and handle potential errors
        let inspectionDates: string[] = [];
        try {
          const parsedDates = form483.inspection_dates ? JSON.parse(form483.inspection_dates) : [];
          inspectionDates = Array.isArray(parsedDates) ? parsedDates : [];
        } catch (e) {
          console.error('Error parsing inspection dates:', e);
        }

        return (
          <div
            key={`${form483.pdf_id}-${index}`}
            className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-gray-600 transition-colors cursor-pointer"
            onClick={() => navigate(`/form-483s/${form483.pdf_id}`)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-700 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white line-clamp-1">
                    {form483.company_affected}
                  </h4>
                  <div className="flex items-center mt-1 text-sm text-gray-400">
                    <Building2 className="h-4 w-4 mr-1.5" />
                    {form483.feinumber}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center text-sm text-gray-400">
                <Package className="h-4 w-4 mr-1.5" />
                {form483.producttype}
              </div>

              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                <span className="line-clamp-1">
                  Inspection Duration: {inspectionDates.length || 'N/A'} days
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-400">
                <Calendar className="h-4 w-4 mr-1.5" />
                Issue Date: {new Date(form483.issue_date).toLocaleDateString()}
              </div>
            </div>

            {/* {form483.url && (
              <div className="mt-6 pt-4 border-t border-gray-700">
                <a
                  href={form483.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm"
                >
                  View Form 483
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            )} */}
          </div>
        );
      })}
    </div>
  );
}