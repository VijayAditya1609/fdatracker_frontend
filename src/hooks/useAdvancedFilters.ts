import { useState, useEffect } from 'react';
import { api } from '../config/api';
import { auth } from '../services/auth';
import { authFetch } from '../services/authFetch';

interface FilterOptions {
  subSystem: string[];
  documentType: string[];
  year: string[];
  qualitySystem: string[];
  region: string[];
  productType: string[];
}

export function useAdvancedFilters() {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    subSystem: [],
    documentType: [],
    year: [],
    qualitySystem: [],
    region: [],
    productType: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setIsLoading(true);
        const response = await authFetch(`${api.search}?pageName=search`);
        if (!response.ok) {
          throw new Error('Failed to fetch filter options');
        }
        const data = await response.json();
        setFilterOptions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load filter options');
      } finally {
        setIsLoading(false);
      }
    };
    

    fetchFilterOptions();
  }, []);

  return { filterOptions, isLoading, error };
}