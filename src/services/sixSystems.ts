import { api } from '../config/api';
import { SixSystemsResponse } from '../types/system';
import { authFetch } from './authFetch';

export const getSixSystemsList = async (): Promise<SixSystemsResponse> => {
  try {
    const response = await authFetch(api.sixSystemsList);


    if (!response.ok) {
      throw new Error('Failed to fetch six systems data');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching six systems data:', error);
    throw error;
  }
};
