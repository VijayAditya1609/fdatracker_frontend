import React, { useState, useEffect } from 'react';
import { MapPin, Building2, FileText, AlertTriangle, ExternalLink } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../../config/api';
import { authFetch } from '../../../services/authFetch';


interface Facility {
  id: string;
  name: string;
  feinumber: string;
  city: string;
  state: string;
  countryname: string;
  count483: string;
  countwl: string;
}

export default function CompanyFacilities() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        const response = await authFetch(`${api.companyFacilitiesData}?companyId=${id}`);
        const data = await response.json();
        setFacilities(data.data || []);
      } catch (err) {
        setError('Failed to load facilities data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2 text-gray-400">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          <p>Loading facilities...</p>
        </div>
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

  if (!facilities.length) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-center">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white">No Facilities Found</h3>
        <p className="mt-2 text-gray-400">This company has no facilities.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {facilities.map((facility) => (
        <div
          key={facility.id}
          onClick={() => navigate(`/facilities/${facility.feinumber}`)}
          className="bg-gray-800 rounded-xl border border-gray-700 p-6 
            hover:bg-gray-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-700 rounded-lg shrink-0">
              <Building2 className="h-6 w-6 text-blue-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">
                {facility.name || 'Unnamed Facility'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-gray-500 shrink-0" />
                <p className="text-sm text-gray-400 truncate">
                  {[
                    facility.city,
                    facility.state !== 'N/A' ? facility.state : null,
                    facility.countryname
                  ]
                    .filter(Boolean)
                    .join(', ') || 'Location not available'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">FEI Number:</span>
              <span className="text-blue-400 font-medium">{facility.feinumber || 'N/A'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col items-center justify-center bg-gray-900/50 rounded-lg p-4 
              border border-gray-700/50">
              <div className="p-2 bg-blue-400/10 rounded-full">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <p className="text-lg font-bold text-white mt-2">
                {parseInt(facility.count483) || 0}
              </p>
              <p className="text-sm text-gray-400">Form 483s</p>
            </div>

            <div className="flex flex-col items-center justify-center bg-gray-900/50 rounded-lg p-4 
              border border-gray-700/50">
              <div className="p-2 bg-yellow-400/10 rounded-full">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <p className="text-lg font-bold text-white mt-2">
                {parseInt(facility.countwl) || 0}
              </p>
              <p className="text-sm text-gray-400">Warning Letters</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
