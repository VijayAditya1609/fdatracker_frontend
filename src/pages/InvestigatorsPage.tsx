import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import InvestigatorCard from '../components/investigators/InvestigatorCard';
import InvestigatorFilters from '../components/investigators/InvestigatorFilters';
import { getInvestigatorsList } from '../services/investigators';
import useDebounce from '../hooks/useDebounce';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { InvestigatorListItem } from '../types/investigator';
import { ArrowDown, ArrowUp } from 'lucide-react';

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

  const fetchInvestigators = useCallback(async (isNewSearch = false) => {
    if (isLoading || (!hasMore && !isNewSearch)) return;

    setIsLoading(true);
    setError(null);

    try {
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
      } else {
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
  }, [debouncedSearch, page, selectedFilters, hasMore, isLoading, sortField, sortDirection, investigators]);

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

        <div className="mt-6">
          <InvestigatorFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            selectedFilters={selectedFilters}
            onFilterChange={(key, value) => 
              setSelectedFilters(prev => ({ ...prev, [key]: value }))
            }
          />

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
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

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investigators.map((investigator) => (
            <InvestigatorCard
              key={investigator.id}
              investigator={investigator}
              onClick={() => navigate(`/investigators/${investigator.id}`)}
            />
          ))}
        </div>

        <div ref={loader} className="mt-8 text-center py-4">
          {isLoading && (
            <div className="text-gray-400">Loading investigators...</div>
          )}
          {error && (
            <div className="text-red-400">{error}</div>
          )}
          {!isLoading && !error && investigators.length === 0 && (
            <div className="text-gray-400">No investigators found</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}