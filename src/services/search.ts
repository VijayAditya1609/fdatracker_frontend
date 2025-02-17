import { api } from '../config/api';
import { auth } from './auth';
import { authFetch } from './authFetch';

export interface Form483SearchResult {
  id: string;
  facilityName: string;
  companyName: string;
  location: string;
  issueDate: string;
  numOfObservations: number;
  systems: string[];

  status: boolean;
}

export interface WarningLetterSearchResult {
  id: string;
  facilityName: string;
  companyName: string | null;
  location: string;
  issueDate: string;
  numOfViolations: number;
  systems: string[];

  productTypes: string[];
  status: boolean;
}

export interface SearchResponse {
  form483: Form483SearchResult[];
  warningLetters: WarningLetterSearchResult[];
  totalForm483: number;
  totalWarningLetters: number;
}

interface SearchFilters {
  documentType: string[];
  year: string[];
  qualitySystem: string[];
  region: string[];
  subSystem: string[];
  productType: string[];
}

export const searchData = async (
  searchQuery: string,
  filters: SearchFilters,
  start: number = 0,
  length: number = 20
): Promise<SearchResponse> => {
  // Convert filters to API parameters
  const params = new URLSearchParams();
  
  // Add search query
  params.append('searchValue', searchQuery);

  // Handle year filter
  if (filters.year.includes('all')) {
    params.append('year', 'all');
  } else {
    params.append('year', filters.year.join(','));
  }

  // Handle region/country filter
  if (filters.region.includes('all')) {
    params.append('country', 'all');
  } else {
    params.append('country', filters.region.join(','));
  }

  // Handle quality system filter
  if (filters.qualitySystem.includes('all')) {
    params.append('qualitySystems', 'all');
  } else {
    params.append('qualitySystems', filters.qualitySystem.join(','));
  }

  // Handle product type filter
  if (filters.productType.includes('all')) {
    params.append('productType', 'all');
  } else {
    params.append('productType', filters.productType.join(','));
  }

  // Handle document type filter
  if (!filters.documentType.includes('all')) {
    params.append('documentType', filters.documentType.join(','));
  }

  // Handle subsystem filter
  if (!filters.subSystem.includes('all')) {
    params.append('subSystems', filters.subSystem.join(','));
  }

  // Add pagination parameters
  params.append('start', start.toString());
  params.append('length', length.toString());

  // Log the final URL for debugging
  console.log(`Making request to: ${api.searchData}?${params.toString()}`);
  const response = await authFetch(`${api.searchData}?${params.toString()}`);

  
  if (!response.ok) {
    throw new Error('Failed to fetch search results');
  }

  return response.json();
}; 