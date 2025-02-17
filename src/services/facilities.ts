import { api } from '../config/api';
import { FacilityResponse } from '../types/facility';
import { auth } from './auth';
import { authFetch } from './authFetch';

export interface FacilityFilters {
  country: string[];
  businessOperation: string[];
}

export const getFacilityFilters = async (): Promise<FacilityFilters> => {
  try {
    const response = await fetch(`${api.filters}?pageName=facilities`);
    if (!response.ok) {
      throw new Error('Failed to fetch facility filters');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching facility filters:', error);
    throw error;
  }
};

export const getFacilities = async (
  searchValue: string,
  start: number,
  length: number,
  country: string,
  businessOperation: string,
  sortField: string,
  sortDirection: string
): Promise<FacilityResponse[]> => {
  const params = new URLSearchParams({
    searchValue,
    start: start.toString(),
    length: length.toString(),
    country: country || 'all',
    businessOperation: businessOperation || 'all',
    orderColumn: sortField,
    orderDir: sortDirection
  });
  const response = await authFetch(`${api.facilitiesList}?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch facilities');
  }
  return response.json();
};