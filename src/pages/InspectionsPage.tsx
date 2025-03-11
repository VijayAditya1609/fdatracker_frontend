// src/pages/InspectionsPage.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import InspectionCard from '../components/inspections/InspectionCard';
import FilterBar from '../components/inspections/FilterBar';
import ActiveFilters from '../components/inspections/ActiveFilters';
import InspectionModal from '../components/inspections/InspectionModal';
import useDebounce from '../hooks/useDebounce';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { api } from '../config/api';
import { auth } from '../services/auth';
import { authFetch } from '../services/authFetch';
import ReactGA from "react-ga4";
import { trackEvent } from "../utils/analytics";

// Define the PostgREST URL constant like in dashboard.ts
const POSTGREST_URL = 'https://app.fdatracker.ai:3000';

export default function InspectionsPage() {
  useDocumentTitle('Inspections');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [inspections, setInspections] = useState([]);
  const [filters, setFilters] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<{ id: string; companyName: string } | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const loader = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Tracking functions for Google Analytics
  const trackSearchQuery = useCallback((query: string) => {
    if (query && query.trim()) {
      trackEvent("Inspections", "Search Query", query.trim());
    }
  }, []);

  const trackFilterUsage = (category: string, filters: Record<string, string>) => {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {  // Only track filters that have been applied
        trackEvent(category, `Filter Applied: ${key}`,  value.toString());
      }
    });
  };

  const trackPageView = useCallback((pageNum: number) => {
    if (pageNum > 1) { // Only track after first page to avoid duplicate page view tracking
      trackEvent("Inspections", "Pagination", `Page ${pageNum}`, pageNum);
    }
  }, []);

  // Fetch inspections using PostgREST
  const fetchInspections = useCallback(async (isNewSearch = false) => {
    if (isLoading || (!hasMore && !isNewSearch)) return;

    setIsLoading(true);
    try {
      const currentPage = isNewSearch ? 0 : page;
      
      // Build PostgREST query parameters
      let queryParams = new URLSearchParams();
      
      // Pagination - PostgREST uses offset and limit
      queryParams.append('offset', (currentPage * 20).toString());
      queryParams.append('limit', '20');
      
      // Sorting
      queryParams.append('order', 'inspectionenddate.desc');
      
      // Search functionality
      if (debouncedSearch) {
        // PostgREST OR filter for searching across multiple columns
        queryParams.append('or', `(feinumber.ilike.*${debouncedSearch}*,legalname.ilike.*${debouncedSearch}*,addressline1.ilike.*${debouncedSearch}*,inspectionid.ilike.*${debouncedSearch}*)`);
        
        // Track search query if this is a new search with query
        if (isNewSearch) {
          trackSearchQuery(debouncedSearch);
        }
      }
      
      // Apply selected filters
      Object.entries(selectedFilters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          // Handle different filter types appropriately
          if (key === 'year') {
            queryParams.append('inspection_year', `eq.${value}`);
          } else if (key === 'country') {
            queryParams.append('countryname', `eq.${value}`);
          } else if (key === 'classificationCode') {
            queryParams.append('classificationcode', `eq.${value}`);
          } else if (key === 'productType') {
            queryParams.append('producttype', `eq.${value}`);
          } else if (key === 'postedCitations') {
            queryParams.append('postedcitations', `eq.${value}`);
          } else {
            // For any other filters
            queryParams.append(key, `eq.${value}`);
          }
        }
      });
      
      // Track filters for the Inspections page
      trackFilterUsage("Inspection Filter", selectedFilters);

      // Use regular fetch with minimal headers like in dashboard.ts
      const response = await fetch(`${POSTGREST_URL}/fda_inspections_view?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch inspections');

      const data = await response.json();

      if (isNewSearch) {
        setInspections(data);
        setPage(1);

        // Track no results scenario
        if (data.length === 0 && debouncedSearch) {
          trackEvent("Inspections", "No Results", debouncedSearch);
        }
      } else {
        // Track pagination
        trackPageView(currentPage + 1);

        setInspections(prev => [...prev, ...data] as typeof prev);
        setPage(prev => prev + 1);
      }

      setHasMore(data.length === 20);
    } catch (err) {
      setError('Failed to load inspections. Please try again later.');
      console.error('Error fetching inspections:', err);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, page, hasMore, isLoading, selectedFilters, trackSearchQuery, trackPageView]);

  // Reset and fetch when search or filters change
  useEffect(() => {
    setInspections([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    fetchInspections(true);
  }, [debouncedSearch, selectedFilters]);

  // Intersection Observer setup
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !error) {
          fetchInspections();
        }
      },
      { threshold: 0.1 }
    );

    if (loader.current) {
      observerRef.current.observe(loader.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, fetchInspections, error]);

  // Fetch filters
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // We'll still use the original API for filters
        const response = await authFetch(`${api.filters}?pageName=inspections`);

        if (!response.ok) throw new Error('Failed to fetch filters');
        const data = await response.json();
        setFilters(data);
      } catch (error) {
        console.error('Error fetching filters:', error);
        setError(error instanceof Error ? error.message : 'Failed to load filters');
      }
    };
    fetchFilters();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? '' : value
    }));
  };

  const handleClearFilter = (key: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const handleInspectionClick = async (inspection: any) => {
    console.log(`Clicked on inspection: ${inspection.classificationcode}`);

    if (inspection.classificationcode.trim().toUpperCase() === 'NAI') {
      console.log('NAI classification detected - Skipping API call and modal trigger');
      return;
    }

    try {
      // We'll still use the original API for this functionality
      const response = await authFetch(`${api.inspectionDetail}?inspectionId=${inspection.id}`);
      const data = await response.json();

      if (data.id === -1) {
        setSelectedInspection({ id: inspection.id, companyName: inspection.legalname });
        setIsModalOpen(true);
      } else {
        window.location.pathname = `/form-483s/${data.id}`;
      }
    } catch (error) {
      console.error('Error fetching inspection details:', error);
    }
  };

  const handleModalSubmit = async () => {
    if (!selectedInspection) return;

    setIsSubmitting(true);
    try {
      const payload = {
        inspectionId: selectedInspection.id,
        companyName: selectedInspection.companyName
      };

      const response = await authFetch(`${api.form483Request}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a separate handler for closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInspection(null);
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-white">FDA Inspections</h1>
            <p className="mt-2 text-sm text-gray-400">
              Comprehensive list of FDA inspections with detailed information and outcomes.
            </p>
          </div>
        </div>

        <div className="mt-2 space-y-4">
          {/* Search Bar and Filter Toggle */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search inspections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 
                         placeholder-gray-400"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 rounded-lg border
                ${showFilters
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700'
                } transition-colors`}
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && filters && (
            <FilterBar
              filters={filters}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearAll={() => setSelectedFilters({})}
            />
          )}

          {/* Active Filters */}
          <ActiveFilters
            selectedFilters={selectedFilters}
            onClearFilter={handleClearFilter}
            onClearAll={() => setSelectedFilters({})}
          />
        </div>

        {/* Inspections Grid */}
        <div className="mt-4 grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {inspections.map((inspection: any) => (
            <InspectionCard
              key={inspection.id}
              inspection={inspection}
              onClick={() => handleInspectionClick(inspection)}
            />
          ))}
        </div>

        {/* Loading and Error States */}
        <div ref={loader} className="mt-8 text-center">
          {isLoading && (
            <div className="text-gray-400">Loading inspections...</div>
          )}
          {error && !isLoading && (
            <div className="text-red-400">{error}</div>
          )}
          {!isLoading && !error && inspections.length === 0 && (
            <div className="text-gray-400">
              No inspections found matching your criteria.
            </div>
          )}
          {!isLoading && !error && !hasMore && inspections.length > 0 && (
            <div className="text-gray-400">No more inspections to load.</div>
          )}
        </div>
      </div>
      {/* {selectedInspection && (
        <InspectionModal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          onSubmit={handleModalSubmit}
          isSubmitting={isSubmitting}
          title="Request Form 483"
          content="This Form 483 is not currently available in our system. Submit a request and our team will process it for you."
        />
      )} */}
    </DashboardLayout>
  );
}
