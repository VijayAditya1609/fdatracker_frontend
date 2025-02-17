import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, ListFilter, Map as MapIcon, Loader2, ChevronDown, ArrowDown, ArrowUp } from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import FacilityMap from '../components/map/FacilityMap';
import FacilityCard from '../components/facilities/FacilityCard';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { getFacilityFilters, getFacilities } from '../services/facilities';
import { FacilityResponse, Facility } from '../types/facility';
import useDebounce from '../hooks/useDebounce';
import Alert from '../components/common/Alert';

// Add these types at the top
type SortField = '2' | '3' | '1';
type SortDirection = 'asc' | 'desc';

interface SortOption {
  label: string;
  field: SortField;
}

const sortOptions: SortOption[] = [
  { label: 'Form 483s', field: '2' },
  { label: 'Warning Letters', field: '3' },
  { label: 'Inspections', field: '1' },
];

export default function FacilitiesPage() {
  useDocumentTitle('Facilities');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedFilters, setSelectedFilters] = useState({
    country: 'all',
    businessOperation: 'all'
  });
  const [view, setView] = useState<'map' | 'grid'>('grid');
  const [filters, setFilters] = useState<any>(null);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Add sort states
  const [sortField, setSortField] = useState<SortField>('2');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Transform API response to Facility type
  const transformFacility = (facility: FacilityResponse): Facility => {
    // Calculate risk level based on violations and inspections
    const riskScore =
      (parseInt(facility.count_wl) * 3 +
        parseInt(facility.count_483) * 2 +
        parseInt(facility.count_inspections)) / 6;

    const riskLevel =
      riskScore >= 2 ? 'High' :
        riskScore >= 1 ? 'Medium' : 'Low';

    // Parse top process types
    const topProcessTypes = facility.top_process_types
      ? facility.top_process_types.split(',').map(type => type.trim())
      : [];

    return {
      id: facility.id,
      name: facility.facility_name,
      companyName: '', // Not provided in API
      feiNumber: facility.feinumber,
      location: facility.address,
      coordinates: [0, 0], // Would need geocoding service
      type: facility.business_operations,
      productTypes: [],
      riskLevel,
      lastInspection: '', // Not provided in API
      complianceScore: Math.max(0, 100 - (riskScore * 20)), // Convert risk to compliance score
      systemsCovered: topProcessTypes,
      inspectionHistory: {
        total: parseInt(facility.count_inspections),
        nai: 0, // Not provided in API
        vai: 0,
        oai: 0
      },
      businessOperations: facility.business_operations,
      countWL: parseInt(facility.count_wl),
      countInspections: parseInt(facility.count_inspections),
      count483: parseInt(facility.count_483),
      topProcessTypes
    };
  };

  // Update fetchFacilities to include sorting
  const fetchFacilities = useCallback(async (isNewSearch = false) => {
    try {
      if (isLoading || (!hasMore && !isNewSearch)) return;

      setIsLoading(true);
      setError(null);
      const data = await getFacilities(
        debouncedSearch,
        isNewSearch ? 0 : page * 20,
        20,
        selectedFilters.country,
        selectedFilters.businessOperation,
        sortField,
        sortDirection
      );

      const transformedFacilities = data.map(transformFacility);

      if (isNewSearch) {
        setFacilities(transformedFacilities);
        setPage(1);
      } else {
        // Prevent duplicates when loading more
        const newFacilities = transformedFacilities.filter(
          (newItem) => !facilities.some(
            (existingItem) => existingItem.id === newItem.id
          )
        );
        setFacilities(prev => [...prev, ...newFacilities]);
        setPage(prev => prev + 1);
      }

      setHasMore(data.length === 20);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load facilities');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, page, selectedFilters, isLoading, hasMore, sortField, sortDirection, facilities]);

  // Fetch filters
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setIsLoadingFilters(true);
        const data = await getFacilityFilters();
        setFilters(data);
      } catch (err) {
        setFilterError(err instanceof Error ? err.message : 'Failed to load filters');
      } finally {
        setIsLoadingFilters(false);
      }
    };

    fetchFilters();
  }, []);

  // Update effect for search/filter/sort changes
  useEffect(() => {
    setFacilities([]);
    setPage(0);
    setHasMore(true);
    fetchFacilities(true);
  }, [debouncedSearch, selectedFilters, sortField, sortDirection]);

  // Infinite scroll setup
  useEffect(() => {
    const currentLoader = loader.current;

    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        fetchFacilities();
      }
    }, options);

    if (currentLoader) {
      observer.current.observe(currentLoader);
    }

    return () => {
      if (currentLoader && observer.current) {
        observer.current.unobserve(currentLoader);
      }
    };
  }, [hasMore, isLoading, fetchFacilities]);

  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Add helper function for button styles
  const getButtonStyle = (field: SortField, direction: SortDirection) => {
    const isActive = sortField === field && sortDirection === direction;
    return `inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors
      ${isActive 
        ? 'bg-blue-600 border-blue-500 text-white' 
        : 'border-gray-600 text-gray-400 hover:text-white hover:border-gray-400'}`;
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-white">Facilities</h1>
            <p className="mt-2 text-sm text-gray-400">
              Comprehensive list of manufacturing facilities with compliance data and risk analysis.
            </p>
          </div>
          {/* <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none space-x-4">
            <button
              onClick={() => setView('grid')}
              className={`btn-secondary inline-flex items-center ${view === 'grid' ? 'bg-gray-600' : ''
                }`}
            >
              <ListFilter className="w-4 h-4 mr-2" />
              Grid View
            </button>
            <button
              onClick={() => setView('map')}
              className={`btn-secondary inline-flex items-center ${view === 'map' ? 'bg-gray-600' : ''
                }`}
            >
              <MapIcon className="w-4 h-4 mr-2" />
              Map View
            </button>
          </div> */}
        </div>

        {/* Search and Filters */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search facilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 
                       placeholder-gray-400"
            />
          </div>

          {isLoadingFilters ? (
            <div className="lg:col-span-2 flex items-center justify-center">
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-400">Loading filters...</span>
            </div>
          ) : filterError ? (
            <div className="lg:col-span-2">
              <Alert type="error" message={filterError} />
            </div>
          ) : filters ? (
            <>
              {/* Country Filter */}
              <div className="relative">
                <select
                  className="block w-full pl-4 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                           text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedFilters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                >
                  <option value="all">All Countries</option>
                  {filters.country
                    .filter(country => country !== 'all')
                    .map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                </select>
                {/* <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" /> */}
              </div>

              {/* Business Operation Filter */}
              <div className="relative">
                <select
                  className="block w-full pl-4 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                           text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedFilters.businessOperation}
                  onChange={(e) => handleFilterChange('businessOperation', e.target.value)}
                >
                  <option value="all">All Operations</option>
                  {filters.businessOperation
                    .filter(operation => operation !== 'all')
                    .map((operation) => (
                      <option key={operation} value={operation}>{operation}</option>
                    ))}
                </select>
                {/* <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" /> */}
              </div>
            </>
          ) : null}

          {/* Add Sort Options */}
          <div className="flex flex-col gap-4 sm:flex-row ">
            {sortOptions.map(({ label, field }) => (
              <div key={field} className="flex gap-2">
                <span className="text-gray-400 flex items-center min-w-24">{label}:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSortField(field);
                      setSortDirection('desc');
                    }}
                    className={getButtonStyle(field, 'desc')}
                  >
                    Highest
                    <ArrowDown className="h-4 w-4" 
                      style={{ opacity: sortField === field && sortDirection === 'desc' ? 1 : 0.5 }}
                    />
                  </button>
                  <button
                    onClick={() => {
                      setSortField(field);
                      setSortDirection('asc');
                    }}
                    className={getButtonStyle(field, 'asc')}
                  >
                    Lowest
                    <ArrowUp className="h-4 w-4"
                      style={{ opacity: sortField === field && sortDirection === 'asc' ? 1 : 0.5 }}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="mt-4">
          {view === 'map' ? (
            <div className="h-[calc(100vh-300px)] rounded-lg overflow-hidden border border-gray-700">
              <FacilityMap facilities={facilities} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {facilities.map((facility) => (
                  <FacilityCard key={facility.id} facility={facility} />
                ))}
              </div>

              {/* Loading and Error States */}
              <div ref={loader} className="mt-8 text-center py-4">
                {isLoading && (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-blue-500 animate-spin mr-2" />
                    <span className="text-gray-400">Loading facilities...</span>
                  </div>
                )}
                {error && !isLoading && (
                  <Alert type="error" message={error} />
                )}
                {!isLoading && !error && facilities.length === 0 && (
                  <div className="text-gray-400">No facilities found matching your criteria.</div>
                )}
                {!isLoading && !error && !hasMore && facilities.length > 0 && (
                  <div className="text-gray-400">No more facilities to load.</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}