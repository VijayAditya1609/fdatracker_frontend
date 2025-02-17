import { api } from '../config/api';
import { auth } from './auth';
import { InvestigatorListResponse } from '../types/investigator';
import { authFetch } from './authFetch';

export const getInvestigatorsList = async (
  start: number,
  length: number,
  searchValue: string,
  year: string,
  status: string,
  sortField: string,
  sortDirection: string
): Promise<InvestigatorListResponse> => {
  try {
    const token = auth.getToken(); // Retrieve JWT token
    const params = new URLSearchParams({
      start: start.toString(),
      length: length.toString(),
      searchValue,
      year,
      status,
      orderColumn: sortField,
      orderDir: sortDirection
    });

    const response = await authFetch(`${api.investigatorsList}?${params}`);


    if (!response.ok) {
      throw new Error('Failed to fetch investigators');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching investigators:', error);
    throw error;
  }
};

export const getInvestigatorDetail = async (id: string) => {
  try {
    const response = await authFetch(`${api.investigatorReport}?id=${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch investigator details');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching investigator details:', error);
    throw error;
  }
};

export const getInvestigatorSubsystems = async (id: string) => {
  try {
    const response = await authFetch(`${api.countOfSubSystemByInvestigator}?id=${id}`);


    if (!response.ok) {
      throw new Error('Failed to fetch investigator subsystems');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching investigator subsystems:', error);
    throw error;
  }
};

export const getInvestigatorInspections = async (
  id: string, 
  type: 'all' | 'converted' | 'not_converted' = 'all'
) => {
  try {
    const response = await authFetch(`${api.investigatorInspections}?id=${id}&type=${type}`);


    if (!response.ok) {
      throw new Error('Failed to fetch investigator inspections');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching investigator inspections:', error);
    throw error;
  }
};

export const getInvestigatorOverview = async (id: string) => {
  try {
    const response = await authFetch(`${api.investigatorOverview}?id=${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch investigator overview');
    }

    const data = await response.json();
    
    return {
      investigationsByYear: data.investigationsByYear || [],
      topSubSystems: data.topSubSystems || {},
      investigatorLocations: data.investigatorLocations || [],
      latestIssueDate: data.latestIssueDate || null,
      conversionRate: data.conversionRate || 0,
      countInspections: data.countInspections || 0,
      countWarningLetter: data.countWarningLetter || 0
    };
  } catch (error) {
    console.error('Error fetching investigator overview:', error);
    throw error;
  }
};
