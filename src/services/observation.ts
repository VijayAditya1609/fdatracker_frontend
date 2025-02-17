import { api } from '../config/api';
import { Form483Observation } from '../types/form483';
import { authFetch } from './authFetch';

export const getObservationDetails = async (id: string): Promise<Form483Observation> => {
  try {
    const response = await authFetch(`${api.observationDetail}?id=${id}`);


    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch observation details');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching observation details:', error);
    throw error;
  }
};