import { useState, useEffect } from 'react';
import { getFilters } from '../services/filters';

export interface FilterResponse {
  country: string[];
  productType: string[];
  year: string[];
  system: string[];
  subsystem: string[];
  status: string[];
}

export interface UseFiltersResult {
  filters: FilterResponse | null;
  selectedFilters: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
}

interface UseFiltersOptions {
  defaultProductType?: string;
}

export function useFilters(pageName: string, options: UseFiltersOptions = {}): UseFiltersResult {
  // Initialize all possible filter types
  const [filters, setFilters] = useState<FilterResponse | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({
    country: '',
    productType: options.defaultProductType || '',
    year: '',
    system: '',
    subsystem: '',
    status: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setIsLoading(true);
        const response = await getFilters(pageName);
        
        // Ensure all filter properties exist
        const normalizedFilters: FilterResponse = {
          country: response.country || [],
          productType: response.productType || [],
          year: response.year || [],
          system: response.system || [],
          subsystem: response.subsystem || [],
          status: response.status || []
        };
        
        setFilters(normalizedFilters);
      } catch (err) {
        console.error('Error fetching filters:', err);
        setError(err instanceof Error ? err.message : 'Failed to load filters');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilters();
  }, [pageName]);

  const setFilter = (key: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? '' : value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      country: '',
      productType: '',
      year: '',
      system: '',
      subsystem: '',
      status: ''
    });
  };

  return {
    filters,
    selectedFilters,
    isLoading,
    error,
    setFilter,
    clearFilters
  };
}