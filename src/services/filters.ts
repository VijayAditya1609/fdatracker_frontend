import { api } from '../config/api';
import { authFetch } from './authFetch';

export interface FilterResponse {
  country: string[];
  productType: string[];
  year: string[];
  system: string[];
  subsystem: string[];
  hasForm483: string[];
  status: string[];
}

export async function getFilters(pageName: string): Promise<FilterResponse> {
  const response = await authFetch(`${api.filters}?pageName=${pageName}`);
  if (!response.ok) {
    throw new Error('Failed to fetch filters');
  }
  return response.json();
}