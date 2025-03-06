import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import SearchBar from '../components/form483/SearchBar';
import FilterBar from '../components/form483/FilterBar';
import ActiveFilters from '../components/form483/ActiveFilters';
import Form483Card from '../components/form483/Form483Card';
import useDebounce from '../hooks/useDebounce';
import { useFilters } from '../hooks/useFilters';
import { api } from '../config/api';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { authFetch } from '../services/authFetch';
import { trackEvent } from "../utils/analytics";
import { auth } from '../services/auth';

// Define the PostgREST URL constant
const POSTGREST_URL = 'https://app.fdatracker.ai:3000';

// Modal Component
interface ModalProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isVisible, message, onClose }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-white text-center">Notification</h2>
        <p className="mt-3 text-sm text-gray-300 text-center">{message}</p>
        <div className="mt-4 flex justify-center">
          <button
            className="py-2 px-4 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

interface Filters {
  searchValue?: string;
  country?: string;
  productType?: string;
  year?: string;
  qualitySystem?: string;
  subSystems?: string;
  status?: string;
}

interface Form483 {
  id: number;
  facilityName: string;
  companyName: string | null;
  location: string;
  issueDate: string;
  numOfObservations: number;
  status: boolean;
  systems: string[];
  wlId?: number;
  productType?: string;
}

export default function Form483sPage() {
  useDocumentTitle('Form 483s');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [form483List, setForm483List] = useState<Form483[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const loader = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Get current user ID for filtering subscribed data
  const currentUser = auth.getUser();
  const currentUserId = currentUser?.id;

  const {
    filters,
    selectedFilters,
    isLoading: isLoadingFilters,
    error: filterError,
    setFilter,
    clearFilters
  } = useFilters('form483s', { defaultProductType: 'Drugs' });

  // Tracking functions for Google Analytics
  const trackSearchQuery = useCallback((query: string) => {
    if (query && query.trim()) {
      trackEvent("Form 483s", "Search Query", query.trim());
    }
  }, []);

  const trackFilterUsage = useCallback((category: string, filters: any) => {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {  // Only track filters that have been applied
        trackEvent(category,`Filter Applied: ${key}`, value.toString());
      }
    });
  }, []);

  const trackPageView = useCallback((pageNum: number) => {
    if (pageNum > 1) { // Only track after first page to avoid duplicate page view tracking
      trackEvent("Form 483s", "Pagination", `Page ${pageNum}`, pageNum);
    }
  }, []);

  const fetchForm483List = useCallback(async (isNewSearch = false) => {
    if (isLoading || (!hasMore && !isNewSearch)) return;

    setIsLoading(true);
    setError(null);

    try {
      const currentPage = isNewSearch ? 0 : page;
      
      // Build PostgREST query parameters
      let queryParams = new URLSearchParams();
      
      // Pagination - PostgREST uses offset and limit
      queryParams.append('offset', (currentPage * 20).toString());
      queryParams.append('limit', '20');
      
      // Sorting
      queryParams.append('order', 'issue_date.desc');
      
      // Search functionality
      if (debouncedSearch) {
        // PostgREST OR filter for searching across multiple columns
        queryParams.append('or', `(facility_name.ilike.*${debouncedSearch}*,company_name.ilike.*${debouncedSearch}*,location.ilike.*${debouncedSearch}*)`);
        
        // Track search query if this is a new search with query
        if (isNewSearch) {
          trackSearchQuery(debouncedSearch);
        }
      }
      
      // Apply selected filters
      if (selectedFilters.country) {
        queryParams.append('location', `ilike.*${selectedFilters.country}*`);
      }
      
      // For product type, use the product_type column directly
      if (selectedFilters.productType) {
        queryParams.append('product_type', `eq.${selectedFilters.productType}`);
      }
      
      if (selectedFilters.year) {
        queryParams.append('year', `eq.${selectedFilters.year}`);
      }
      
      if (selectedFilters.system) {
        queryParams.append('systems', `cs.{${selectedFilters.system}}`);
      }
      
      if (selectedFilters.subsystem) {
        queryParams.append('subsystems', `cs.{${selectedFilters.subsystem}}`);
      }
      
      if (selectedFilters.status) {
        if (selectedFilters.status === 'With Warning Letter') {
          queryParams.append('has_warning_letter', 'eq.true');
        } else if (selectedFilters.status === 'Without Warning Letter') {
          queryParams.append('has_warning_letter', 'eq.false');
        }
      }
      
      // User philosophy: Only show subscribed data if it matches current user
      // We need to build a condition for this
      let url = `${POSTGREST_URL}/vw_form_483?`;
      
      // Base query with all the parameters except the user condition
      url += queryParams.toString();
      
      // Add the data source filter directly to the URL
      if (currentUserId) {
        // If user is logged in, show public data OR their own subscribed data
        // For subscribed data, ensure user_id matches
        url += `&or=(data_source.eq.public,and(data_source.eq.subscribed,user_id.eq.${currentUserId}))`;
      } else {
        // If no user is logged in, only show public data
        url += `&data_source=eq.public`;
      }
      
      // Track filters for the Form 483 page
      trackFilterUsage("Form 483 Filter", selectedFilters);

      console.log('Fetching Form 483s with URL:', url);

      // Use regular fetch with minimal headers
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch Form 483s");
      }

      const rawData = await response.json();
      console.log('Received data:', rawData);
      
      // Transform the data to match the expected format for Form483Card
      const transformedData: Form483[] = rawData.map((item: any) => ({
        id: item.id,
        facilityName: item.facility_name,
        companyName: item.company_name,
        location: item.location,
        issueDate: item.issue_date,
        numOfObservations: parseInt(item.num_of_observations) || 0,
        status: item.has_warning_letter,
        systems: Array.isArray(item.systems) ? item.systems : [],
        wlId: item.wl_id,
        productType: item.product_type
      }));

      if (isNewSearch) {
        setForm483List(transformedData);
        setPage(1);
        
        // Track no results scenario
        if (transformedData.length === 0 && debouncedSearch) {
          trackEvent("Form 483s", "No Results", debouncedSearch);
        }
      } else {
        // Track pagination
        trackPageView(currentPage + 1);
        
        setForm483List((prev) => [...prev, ...transformedData]);
        setPage((prev) => prev + 1);
      }

      setHasMore(transformedData.length === 20);
    } catch (err) {
      setError("Failed to load Form 483s. Please try again later.");
      setShowModal(true);
      console.error("Error fetching Form 483s:", err);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, page, hasMore, isLoading, selectedFilters, currentUserId, trackSearchQuery, trackPageView, trackFilterUsage]);

  useEffect(() => {
    setForm483List([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    fetchForm483List(true);
  }, [debouncedSearch, selectedFilters]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !error) {
          fetchForm483List();
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
  }, [hasMore, isLoading, fetchForm483List, error]);

  const handleForm483Click = (id: number) => {
    trackEvent("Form 483s", "Item Click", `Form 483 ID: ${id}`);
    
    navigate(`/form-483s/${id}`);
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-white">Form 483s</h1>
            <p className="mt-2 text-sm text-gray-400">
              Comprehensive list of FDA Form 483s with observations and analysis.
            </p>
          </div>
        </div>

        <div className="mt-2 space-y-4">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />

          {showFilters && (
            <>
              {isLoadingFilters ? (
                <div className="text-gray-400">Loading filters...</div>
              ) : filterError ? (
                <div className="text-red-400">{filterError}</div>
              ) : filters ? (
                <FilterBar
                  filters={filters}
                  selectedFilters={selectedFilters}
                  onFilterChange={setFilter}
                />
              ) : null}
            </>
          )}

          <ActiveFilters
            selectedFilters={selectedFilters}
            onClearFilter={(key) => setFilter(key, '')}
            onClearAll={clearFilters}
          />
        </div>

        <div className="mt-4 grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {form483List.map((form483) => (
            <Form483Card
              key={form483.id}
              form483={form483}
              onClick={() => handleForm483Click(form483.id)}
            />
          ))}
        </div>

        <div ref={loader} className="mt-8 text-center">
          {isLoading && (
            <div className="text-gray-400">Loading Form 483s...</div>
          )}
          {error && !isLoading && (
            <div className="text-red-400">{error}</div>
          )}
          {!isLoading && !error && form483List.length === 0 && (
            <div className="text-gray-400">No Form 483s found matching your criteria.</div>
          )}
          {!isLoading && !error && !hasMore && form483List.length > 0 && (
            <div className="text-gray-400">No more Form 483s to load.</div>
          )}
        </div>

        <Modal
          isVisible={showModal}
          message={error || ''}
          onClose={() => setShowModal(false)}
        />
      </div>
    </DashboardLayout>
  );
}
