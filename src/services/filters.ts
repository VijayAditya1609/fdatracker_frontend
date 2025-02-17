import { api } from '../config/api';

export interface FilterResponse {
  country: string[];
  productType: string[];
  year: string[];
  system: string[];
  subsystem: string[];
}

export async function getFilters(pageName: string): Promise<FilterResponse> {
  const response = await fetch(`${api.filters}?pageName=${pageName}`);
  if (!response.ok) {
    throw new Error('Failed to fetch filters');
  }
  return response.json();
}