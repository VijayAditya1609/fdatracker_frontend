import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, MapPin, Clock, Filter, Building2, X, Activity ,ArrowUpDown, ArrowUp, ArrowDown} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import CompanyCard from '../components/companies/CompanyCard';
import { api } from '../config/api';
import useDebounce from '../hooks/useDebounce';
import { Company } from '../types/company';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { auth } from '../services/auth';
import { authFetch } from '../services/authFetch';

type SortField = '2' | '1' | '3' ;
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
  

  const fetchCompanies = useCallback(async (isNewSearch = false) => {
    if (isLoading || (!hasMore && !isNewSearch)) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const currentPage = isNewSearch ? 0 : page;
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
      } else {
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
  }, [debouncedSearch, page, hasMore, isLoading, sortField, sortDirection, companies]);

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
    navigate(`/companies/${companyId}`);
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
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

        {/* Active Filters */}
        {/* {Object.entries(selectedFilters).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([key, values]) =>
              values.map((value) => (
                <span
                  key={`${key}-${value}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-400/10 text-blue-400 text-sm"
                >
                  <span className="text-gray-400">{key}:</span>
                  {value}
                  <button
                    onClick={() => {
                      const newFilters = { ...selectedFilters };
                      newFilters[key] = newFilters[key].filter(v => v !== value);
                      if (newFilters[key].length === 0) {
                        delete newFilters[key];
                      }
                      setSelectedFilters(newFilters);
                    }}
                    className="ml-1 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))
            )}
            <button
              onClick={() => setSelectedFilters({})}
              className="text-sm text-gray-400 hover:text-white"
            >
              Clear all
            </button>
          </div>
        )} */}

        {/* Filter Categories */}
        {/* {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.name} className="relative">
                <select
                  className="block w-full pl-4 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                           text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => {
                    if (e.target.value) {
                      setSelectedFilters(prev => ({
                        ...prev,
                        [filter.name]: [e.target.value]
                      }));
                    }
                  }}
                  value={selectedFilters[filter.name]?.[0] || ''}
                >
                  <option value="">{filter.name}</option>
                  {filter.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )} */}

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
        <div ref={loader} className="mt-8 text-center">
          {isLoading && (
            <div className="text-gray-400">Loading companies...</div>
          )}
          {error && (
            <div className="text-red-400">
              {error}
            </div>
          )}
          {!hasMore && companies.length > 0 && (
            <div className="text-gray-400">No more companies to load.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}