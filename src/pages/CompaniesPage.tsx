import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, MapPin, Clock, Filter, Building2, X, Activity, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import CompanyCard from '../components/companies/CompanyCard';
import { api } from '../config/api';
import useDebounce from '../hooks/useDebounce';
import { Company } from '../types/company';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { auth } from '../services/auth';
import { authFetch } from '../services/authFetch';
import { trackEvent } from "../utils/analytics";
// Add GA import
import ReactGA from "react-ga4";

type SortField = '2' | '1' | '3';
type SortDirection = 'asc' | 'desc';

interface SortOption {
  label: string;
  field: SortField;
}

const sortOptions: SortOption[] = [
  { label: 'Form 483s', field: '2' },
  { label: 'Inspections', field: '1' },
  { label: 'Warning Letters', field: '3' },
];

const filters = [
  { 
    name: 'Company Type',
    options: ['All', 'Manufacturer', 'API Manufacturer', 'Contract Manufacturer', 'Testing Laboratory']
  },
  {
    name: 'Risk Level',
    options: ['All', 'High', 'Medium', 'Low']
  },
  {
    name: 'Location',
    options: ['All', 'United States', 'India', 'China', 'Europe', 'Other']
  }
];

export default function CompaniesPage() {
  useDocumentTitle('Companies');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(true);
  const [sortField, setSortField] = useState<SortField>('2');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const loader = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  
  // Add GA tracking functions
  const trackSearch = useCallback((query: string) => {
    if (query && query.trim()) {
      // ReactGA.event({
      //   category: "Companies",
      //   action: "Search Query",
      //   label: query.trim()
      // });
      trackEvent("Companies", "Search Query", query.trim());
    }
  }, []);

  const trackSort = useCallback((field: SortField, direction: SortDirection) => {
    const fieldLabel = sortOptions.find(option => option.field === field)?.label || field;
    // ReactGA.event({
    //   category: "Companies",
    //   action: "Sort",
    //   label: `${fieldLabel} - ${direction === 'asc' ? 'Lowest' : 'Highest'}`
    // });
    trackEvent("Companies", "Sort", `${fieldLabel} - ${direction === 'asc' ? 'Lowest' : 'Highest'}`);
  }, []);

  const trackPageView = useCallback((pageNum: number) => {
    if (pageNum > 1) { // Only track after first page to avoid duplicate page view tracking
      // ReactGA.event({
      //   category: "Companies",
      //   action: "Pagination",
      //   label: `Page ${pageNum}`,
      //   value: pageNum
      // });
      trackEvent("Companies", "Pagination", `Page ${pageNum}`, pageNum);
    }
  }, []);

  // const trackCompanyClick = useCallback((companyId: string, companyName: string) => {
  //   ReactGA.event({
  //     category: "Companies",
  //     action: "Item Click",
  //     label: `Company Name: ${companyName} : ${companyId}`
  //   });
  // }, []); 

  const fetchCompanies = useCallback(async (isNewSearch = false) => {
    if (isLoading || (!hasMore && !isNewSearch)) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const currentPage = isNewSearch ? 0 : page;
      
      // Track search if this is a new search with query
      if (isNewSearch && debouncedSearch) {
        trackSearch(debouncedSearch);
      }
      
      const params = new URLSearchParams({
        start: (currentPage * 20).toString(),
        length: '20',
        searchValue: debouncedSearch,
        orderColumn: sortField,
        orderDir: sortDirection
      });
      const response = await authFetch(`${api.companiesList}?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }

      const data = await response.json();
      
      if (isNewSearch) {
        setCompanies(data);
        setPage(1);
        
        // Track no results scenario
        if (data.length === 0 && debouncedSearch) {
          // ReactGA.event({
          //   category: "Companies",
          //   action: "No Results",
          //   label: debouncedSearch
          // });
          trackEvent("Companies", "No Results", debouncedSearch);


        }
      } else {
        // Track pagination
        trackPageView(page + 1);
        
        // Prevent duplicates when loading more
        const newCompanies = data.filter(
          (newItem: any) => !companies.some(
            (existingItem) => existingItem.id === newItem.id
          )
        );
        setCompanies(prev => [...prev, ...newCompanies]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(data.length === 20);
    } catch (err) {
      setError('Failed to load companies. Please try again later.');
      console.error('Error fetching companies:', err);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, page, hasMore, isLoading, sortField, sortDirection, companies, trackSearch, trackPageView]);

  useEffect(() => {
    setCompanies([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    fetchCompanies(true);
  }, [debouncedSearch, sortField, sortDirection]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !error) {
          fetchCompanies();
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
  }, [hasMore, isLoading, fetchCompanies, error]);

  const handleCompanyClick = (companyId: string) => {
    // Get company name for better tracking label
    // const company = companies.find(c => c.id === companyId);
    // const companyName = company?.company_name || companyId;
    // ReactGA.event({
    //   category: "Companies",
    //   action: "Item Click",
    //   label: `Company Name: ${companyId} : ${companyName}`
    // });
    // Track company selection
    // trackCompanyClick(companyId, companyName);
    
    // Navigate to company details
    navigate(`/companies/${companyId}`);
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
            <h1 className="text-2xl font-semibold text-white">Companies</h1>
            <p className="mt-2 text-sm text-gray-400">
              Comprehensive overview of pharmaceutical companies with compliance history and risk analysis.
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-4 space-y-4">
          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Track explicit Enter key search
                    // ReactGA.event({
                    //   category: "Companies",
                    //   action: "Search Query",
                    //   label: searchQuery.trim().toLowerCase(),
                    // });
                    trackEvent("Companies", "Search Query", searchQuery.trim().toLowerCase());
                    // Immediately fetch to avoid waiting for debounce
                    if (searchQuery.trim()) {
                      trackSearch(searchQuery);
                      fetchCompanies(true);
                    }
                  }
                }}
                className="block w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 
                         placeholder-gray-400"
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
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

        {/* Companies Grid */}
        <div className="mt-4 grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onClick={() => handleCompanyClick(company.id)}
            />
          ))}
        </div>

        {/* Loading and Error States */}
        <div ref={loader} className="mt-8 text-center py-4">
          {isLoading && (
            <div className="flex items-center justify-center">
              <div className="text-gray-400">Loading companies...</div>
            </div>
          )}
          {error && (
            <div className="text-red-400">
              {error}
            </div>
          )}
          {!isLoading && !error && companies.length === 0 && (
            <div className="text-gray-400">No companies found matching your criteria.</div>
          )}
          {!hasMore && companies.length > 0 && !isLoading && (
            <div className="text-gray-400">No more companies to load.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}