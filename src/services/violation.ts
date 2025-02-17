import { api } from '../config/api';
import { Violation } from '../types/warningLetter';
import { authFetch } from './authFetch';

export const getViolationDetails = async (id: string): Promise<Violation> => {
  try {
    const response = await authFetch(`${api.violationDetail}?id=${id}`);


    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to fetch violation details');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching violation details:', error);
    throw error;
  }
};