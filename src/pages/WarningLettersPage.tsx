import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import SearchBar from '../components/warningLetter/SearchBar';
import FilterBar from '../components/warningLetter/FilterBar';
import ActiveFilters from '../components/form483/ActiveFilters';
import WarningLetterCard from '../components/warningLetter/WarningLetterCard';
import useDebounce from '../hooks/useDebounce';
import { useFilters } from '../hooks/useFilters';
import { api } from '../config/api';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { auth } from '../services/auth';
import { authFetch } from '../services/authFetch';
import ReactGA from "react-ga4";
import { trackEvent } from "../utils/analytics";

// Define the PostgREST URL constant
const POSTGREST_URL = 'https://app.fdatracker.ai:3000';
const WARNING_LETTERS_VIEW = 'vw_warning_letters';

interface WarningLetter {
  id: number;
  linked483Id: number | null;
  facilityName: string;
  companyName: string | null;
  location: string;
  issueDate: string;
  numOfViolations: number;
  status: boolean;
  systems: string[];
  productTypes: string[];
}

interface Filters {
  searchValue?: string;
  country?: string;
  productType?: string;
  year?: string;
  qualitySystem?: string;
  subSystems?: string;
  hasForm483?: string;
}

export default function WarningLettersPage() {
  useDocumentTitle('Warning Letters');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [warningLetters, setWarningLetters] = useState<WarningLetter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(true);
  const loader = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Get filters from custom hook with default product type
  const {
    filters,
    selectedFilters,
    isLoading: isLoadingFilters,
    error: filterError,
    setFilter,
    clearFilters
  } = useFilters('warningLetters', { defaultProductType: 'Drugs' });

  // Tracking functions for Google Analytics
  const trackSearchQuery = useCallback((query: string) => {
    if (query && query.trim()) {
      trackEvent("Warning Letters", "Search Query", query.trim());
    }
  }, []);

  const trackFilterUsage = useCallback((category: string, filters: Filters) => {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {  // Only track filters that have been applied
        trackEvent(category,`Filter Applied: ${key}`, value.toString());
      }
    });
  }, []);

  const trackPageView = useCallback((pageNum: number) => {
    if (pageNum > 1) { // Only track after first page to avoid duplicate page view tracking
      trackEvent("Warning Letters", "Pagination", `Page ${pageNum}`, pageNum);
    }
  }, []);

  const fetchWarningLetters = useCallback(async (isNewSearch = false) => {
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
      
      if (selectedFilters.productType) {
        // For product types, which is stored as a text column in the view
        // Use ilike for partial matching
        queryParams.append('product_types', `ilike.*${selectedFilters.productType}*`);
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
      
      if (selectedFilters.hasForm483) {
        if (selectedFilters.hasForm483 === 'yes') {
          queryParams.append('has_form_483', 'eq.true');
        } else if (selectedFilters.hasForm483 === 'no') {
          queryParams.append('has_form_483', 'eq.false');
        }
      }
      
      // Track filters for the Warning Letters page
      trackFilterUsage("Warning Letter Filter", selectedFilters);

      console.log('Fetching Warning Letters with URL:', `${POSTGREST_URL}/${WARNING_LETTERS_VIEW}?${queryParams}`);

      // Use regular fetch with minimal headers
      const response = await fetch(`${POSTGREST_URL}/${WARNING_LETTERS_VIEW}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch warning letters');
      }

      const rawData = await response.json();
      console.log('Received data:', rawData);
      
      // Transform the data to match the expected format for WarningLetterCard
      const transformedData: WarningLetter[] = rawData.map((item: any) => {
        // Parse product_types if it's a string
        let productTypes: string[] = [];
        if (typeof item.product_types === 'string') {
          // Try to parse as JSON if it looks like an array
          if (item.product_types.startsWith('[') && item.product_types.endsWith(']')) {
            try {
              productTypes = JSON.parse(item.product_types);
            } catch (e) {
              // If parsing fails, treat as a single item
              productTypes = [item.product_types];
            }
          } else {
            // If it's just a string, use it as a single item
            productTypes = [item.product_types];
          }
        } else if (Array.isArray(item.product_types)) {
          productTypes = item.product_types;
        }
        
        return {
          id: item.id,
          linked483Id: item.linked_483_id,
          facilityName: item.facility_name,
          companyName: item.company_name,
          location: item.location,
          issueDate: item.issue_date,
          numOfViolations: parseInt(item.num_of_violations) || 0,
          status: item.has_form_483,
          systems: Array.isArray(item.systems) ? item.systems : [],
          productTypes: productTypes
        };
      });

      if (isNewSearch) {
        setWarningLetters(transformedData);
        setPage(1);
        
        // Track no results scenario
        if (transformedData.length === 0 && debouncedSearch) {
          trackEvent("Warning Letters", "No Results", debouncedSearch);
        }
      } else {
        // Track pagination
        trackPageView(currentPage + 1);
        
        setWarningLetters((prev) => [...prev, ...transformedData]);
        setPage((prev) => prev + 1);
      }

      // Update `hasMore` based on the response
      setHasMore(transformedData.length === 20);
    } catch (err) {
      setError('Failed to load warning letters. Please try again later.');
      console.error('Error fetching warning letters:', err);
      setHasMore(false); // Prevent further loading when an error occurs
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, page, hasMore, isLoading, selectedFilters, trackSearchQuery, trackFilterUsage, trackPageView]);

  useEffect(() => {
    setWarningLetters([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    fetchWarningLetters(true);
  }, [debouncedSearch, selectedFilters]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !error) {
          fetchWarningLetters();
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
  }, [hasMore, isLoading, fetchWarningLetters, error]);

  const handleWarningLetterClick = (id: number) => {
    // Track Warning Letter clicks
    trackEvent("Warning Letters", "Item Click",`Warning Letter ID: ${id}`);
    
    navigate(`/warning-letters/${id}`);
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-white">Warning Letters</h1>
            <p className="mt-2 text-sm text-gray-400">
              Comprehensive list of FDA Warning Letters with violations and compliance analysis.
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
          {warningLetters.length > 0 ? (
            warningLetters.map((letter) => (
              <WarningLetterCard
                key={letter.id}
                warningLetter={letter}
                onClick={() => handleWarningLetterClick(letter.id)}
              />
            ))
          ) : (
            !isLoading && !error && (
              <div className="text-center text-gray-400 col-span-full">
                No warning letters match your search criteria.
              </div>
            )
          )}
        </div>

        <div ref={loader} className="mt-8 text-center">
          {isLoading && (
            <div className="text-gray-400">Loading warning letters...</div>
          )}
          {error && (
            <div className="text-red-400">{error}</div>
          )}
          {!hasMore && warningLetters.length > 0 && (
            <div className="text-gray-400">No more warning letters to load.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
