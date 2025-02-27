import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import InvestigatorCard from '../components/investigators/InvestigatorCard';
import InvestigatorFilters from '../components/investigators/InvestigatorFilters';
import { getInvestigatorsList } from '../services/investigators';
import useDebounce from '../hooks/useDebounce';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { InvestigatorListItem } from '../types/investigator';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { trackEvent } from "../utils/analytics";
// Add GA import
import ReactGA from "react-ga4";

type SortField = '1' | '2' | '3';
type SortDirection = 'asc' | 'desc';

interface SortOption {
  label: string;
  field: SortField;
}

const sortOptions: SortOption[] = [
  { label: 'Form 483s', field: '1' },
  { label: 'Warning Letters', field: '2' },
  { label: 'Conversion Rate', field: '3' },
];

export default function InvestigatorsPage() {
  useDocumentTitle('Investigators');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [investigators, setInvestigators] = useState<InvestigatorListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const [sortField, setSortField] = useState<SortField>('1');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Add GA tracking functions
  const trackSearch = useCallback((query: string) => {
    if (query && query.trim()) {
      // ReactGA.event({
      //   category: "Investigators",
      //   action: "Search Query",
      //   label: query.trim()
      // });
      trackEvent("Investigators", "Search Query", query.trim());
    }
  }, []);

  const trackSort = useCallback((field: SortField, direction: SortDirection) => {
    const fieldLabel = sortOptions.find(option => option.field === field)?.label || field;
    // ReactGA.event({
    //   category: "Investigators",
    //   action: "Sort",
    //   label: `${fieldLabel} - ${direction === 'asc' ? 'Lowest' : 'Highest'}`
    // });
    trackEvent("Investigators", "Sort",`${fieldLabel} - ${direction === 'asc' ? 'Lowest' : 'Highest'}`);
  }, []);

  const trackPageView = useCallback((pageNum: number) => {
    if (pageNum > 1) { // Only track after first page to avoid duplicate page view tracking
      // ReactGA.event({
      //   category: "Investigators",
      //   action: "Pagination",
      //   label: `Page ${pageNum}`,
      //   value: pageNum
      // });
      trackEvent("Investigators", "Pagination", `Page ${pageNum}`, pageNum);
    }
  }, []);

  const trackInvestigatorClick = useCallback((investigatorId: string, investigatorName: string) => {
    // ReactGA.event({
    //   category: "Investigators",
    //   action: "Item Click",
    //   label: `Investigator Name: ${investigatorName} : ${investigatorId}`
    // });
    trackEvent("Investigators", "Item Click", `Investigator Name: ${investigatorName} : ${investigatorId}`);

  }, []);

  const fetchInvestigators = useCallback(async (isNewSearch = false) => {
    if (isLoading || (!hasMore && !isNewSearch)) return;

    setIsLoading(true);
    setError(null);

    try {
      // Track search if this is a new search with query
      if (isNewSearch && debouncedSearch) {
        trackSearch(debouncedSearch);
      }

      const response = await getInvestigatorsList(
        isNewSearch ? 0 : page * 20,
        20,
        debouncedSearch,
        selectedFilters.year || 'all',
        selectedFilters.status || 'all',
        sortField,
        sortDirection
      );

      if (isNewSearch) {
        setInvestigators(response.data);
        setPage(1);

        // Track no results scenario
        if (response.data.length === 0 && debouncedSearch) {
          // ReactGA.event({
          //   category: "Investigators",
          //   action: "No Results",
          //   label: debouncedSearch
          // });
          trackEvent("Investigators", "No Results", debouncedSearch);
        }
      } else {
        // Track pagination
        trackPageView(page + 1);

        const newInvestigators = response.data.filter(
          (newItem: any) => !investigators.some(
            (existingItem) => existingItem.id === newItem.id
          )
        );
        setInvestigators(prev => [...prev, ...newInvestigators]);
        setPage(prev => prev + 1);
      }

      setHasMore(response.data.length === 20);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load investigators');
      console.error('Error fetching investigators:', err);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, page, selectedFilters, hasMore, isLoading, sortField, sortDirection, investigators, trackSearch, trackPageView]);

  useEffect(() => {
    setInvestigators([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    fetchInvestigators(true);
  }, [debouncedSearch, selectedFilters, sortField, sortDirection]);

  useEffect(() => {
    const currentLoader = loader.current;

    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !isLoading && !error) {
        fetchInvestigators();
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
  }, [hasMore, isLoading, fetchInvestigators, error]);

  const handleInvestigatorClick = (investigatorId: string) => {
    // Get investigator name for better tracking label
    const investigator = investigators.find(i => i.id === investigatorId);
    const investigatorName = investigator?.investigator_name || investigatorId;

    // Track investigator selection
    trackInvestigatorClick(investigatorId, investigatorName);

    // Navigate to investigator details
    navigate(`/investigators/${investigatorId}`);
  };

  const handleSort = (field: SortField, direction: SortDirection) => {
    if (field !== sortField || direction !== sortDirection) {
      trackSort(field, direction);
      setSortField(field);
      setSortDirection(direction);
    }
  };

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
            <h1 className="text-2xl font-semibold text-white">FDA Investigators</h1>
            <p className="mt-2 text-sm text-gray-400">
              Comprehensive list of FDA investigators with their inspection history and specializations.
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {/* Search Bar
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search investigators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Track explicit Enter key search
                    ReactGA.event({
                      category: "Investigators",
                      action: "Search Method",
                      label: "Enter Key"
                    });
                    // Immediately fetch to avoid waiting for debounce
                    if (searchQuery.trim()) {
                      trackSearch(searchQuery);
                      fetchInvestigators(true);
                    }
                  }
                }}
                className="block w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 
                         placeholder-gray-400"
              />
            </div>
          </div> */}

          <div className="mt-4">
            <InvestigatorFilters
              searchQuery={searchQuery}
              onSearchChange={(value) => {
                setSearchQuery(value);
                // No need to trackSearch here as it will be done in fetchInvestigators when the debounce happens
              }}
              // onSearchKeyDown={(e) => {
              //   if (e.key === 'Enter') {
              //     // Track explicit Enter key search
              //     ReactGA.event({
              //       category: "Investigators",
              //       action: "Search Method",
              //       label: "Enter Key"
              //     });
              //     // Immediately fetch to avoid waiting for debounce
              //     if (searchQuery.trim()) {
              //       trackSearch(searchQuery);
              //       fetchInvestigators(true);
              //     }
              //   }
              // }}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
              selectedFilters={selectedFilters}
              onFilterChange={(key, value) => {
                // ReactGA.event({
                //   category: "Investigators",
                //   action: "Filter Applied:",
                //   label: `${key}: ${value}`
                // });
                trackEvent("Investigators", "Filter Applied:", `${key}: ${value}`);
                setSelectedFilters(prev => ({ ...prev, [key]: value }));
              }}
            />
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {sortOptions.map(({ label, field }) => (
              <div key={field} className="flex gap-2">
                <span className="text-gray-400 flex items-center min-w-24">{label}:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSort(field, 'desc')}
                    className={getButtonStyle(field, 'desc')}
                  >
                    Highest
                    <ArrowDown className="h-4 w-4"
                      style={{ opacity: sortField === field && sortDirection === 'desc' ? 1 : 0.5 }}
                    />
                  </button>
                  <button
                    onClick={() => handleSort(field, 'asc')}
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

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investigators.map((investigator) => (
            <InvestigatorCard
              key={investigator.id}
              investigator={investigator}
              onClick={() => handleInvestigatorClick(investigator.id)}
            />
          ))}
        </div>

        <div ref={loader} className="mt-8 text-center py-4">
          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="text-gray-400">Loading investigators...</div>
            </div>
          )}
          {error && (
            <div className="text-red-400">{error}</div>
          )}
          {!isLoading && !error && investigators.length === 0 && (
            <div className="text-gray-400">No investigators found matching your criteria.</div>
          )}
          {!hasMore && investigators.length > 0 && !isLoading && (
            <div className="text-gray-400">No more investigators to load.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}