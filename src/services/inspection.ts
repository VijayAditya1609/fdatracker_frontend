import { api } from '../config/api';
import { Inspection, InspectionFilters } from '../types/inspection';
import { authFetch } from './authFetch';

export const getInspectionsList = async (params: Record<string, string>): Promise<Inspection[]> => {
  try {
    const queryParams = new URLSearchParams(params);
    const response = await authFetch(`${api.inspectionsList}?${queryParams}`);

    if (!response.ok) {
      throw new Error('Failed to fetch inspections');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching inspections:', error);
    throw error;
  }
};

export const getInspectionFilters = async (): Promise<InspectionFilters> => {
  try {
    const response = await fetch(`${api.filters}?pageName=inspections`);
    if (!response.ok) {
      throw new Error('Failed to fetch inspection filters');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching inspection filters:', error);
    throw error;
  }
};