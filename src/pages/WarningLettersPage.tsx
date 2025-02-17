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

interface WarningLetter {
  id: number;
  facilityName: string;
  companyName: string | null;
  location: string;
  issueDate: string;
  numOfViolations: number;
  status: boolean;
  systems: string[];
  productTypes: string[];
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

  const fetchWarningLetters = useCallback(async (isNewSearch = false) => {
    if (isLoading || (!hasMore && !isNewSearch)) return;

    setIsLoading(true);
    setError(null);

    try {
      const currentPage = isNewSearch ? 0 : page;
      const params = new URLSearchParams({
        start: (currentPage * 20).toString(),
        length: '20',
        searchValue: debouncedSearch,
        country: selectedFilters.country,
        productType: selectedFilters.productType,
        year: selectedFilters.year,
        qualitySystem: selectedFilters.system,
        subSystems: selectedFilters.subsystem,
        hasForm483: selectedFilters.hasForm483
      });
      const response = await authFetch(`${api.warningLettersList}?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch warning letters');
      }

      const data = await response.json();

      if (isNewSearch) {
        setWarningLetters(data);
        setPage(1);
      } else {
        setWarningLetters((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      }

      // Update `hasMore` based on the response
      setHasMore(data.length === 20);
    } catch (err) {
      setError('Failed to load warning letters. Please try again later.');
      console.error('Error fetching warning letters:', err);
      setHasMore(false); // Prevent further loading when an error occurs
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, page, hasMore, isLoading, selectedFilters]);

  useEffect(() => {
    setWarningLetters([]);
    setPage(0);
    setHasMore(true);
    fetchWarningLetters(true);
  }, [debouncedSearch, selectedFilters]);


  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
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
  }, [hasMore, isLoading, fetchWarningLetters]);

  const handleWarningLetterClick = (id: number) => {
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