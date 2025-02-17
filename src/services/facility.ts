import { api, API_BASE_URL } from '../config/api';
import { auth } from './auth';
import { authFetch } from './authFetch';

export interface TopInvestigator {
  count_wl: Number;
  count_inspections: Number;
  count_483: Number;
  investigator: string;
  count: string;
}

export interface ChartData {
  classificationcode: string;
  extract: string;
  count: string;
}

export interface FacilityStats {
  count_wl: string;
  count_inspections: string;
  count_483: string;
}

export interface FacilityDetailResponse {
  stats: FacilityStats;
  topInvestigators: TopInvestigator[];
  status: string;
}

export interface ProcessTypesCount {
  [key: string]: number;
}

export interface Form483AndWL {
  facilitiesInspectionsList483: Array<{
    company_affected: string;
    inspection_dates: string;
    feinumber: string;
    warning_letter_id: string;
    issue_date: string;
    pdf_id: string;
    url: string;
    producttype: string;
  }>;
  facilitiesInspectionsListWl: Array<{
    company_affected: string;
    inspection_dates: string;
    feinumber2: string;
    warning_letter_id: string;
    issue_date: string;
    id: string;
    letter_url: string;
    producttype: string;
  }>;
}



export const getFacilityTopInvestigators = async (feinumber: string): Promise<FacilityDetailResponse> => {
  const response = await authFetch(`${API_BASE_URL}/api/facilityDetail?feinumber=${feinumber}`);

  if (!response.ok) throw new Error('Failed to fetch facility investigators');
  return response.json();
};

export const getFacilityChartData = async (feinumber: string): Promise<ChartData[]> => {
  const response = await authFetch(`${API_BASE_URL}/api/facilityChartsData?feinumber=${feinumber}`);

  if (!response.ok) throw new Error('Failed to fetch facility chart data');
  const data = await response.json();
  return data.data;
};

export const getFacilitySubsystems = async (feinumber: string): Promise<ProcessTypesCount> => {
  const response = await authFetch(`${API_BASE_URL}/api/facilitySubSystems?feinumber=${feinumber}`);

  if (!response.ok) throw new Error('Failed to fetch facility subsystems');
  const data = await response.json();
  return data.processTypesCount;
};

export const getFacilityForm483AndWL = async (feinumber: string, type: string = 'all'): Promise<Form483AndWL> => {
  const response = await authFetch(`${API_BASE_URL}/api/facilityForm483andWL?feinumber=${feinumber}&type=${type}`);

  if (!response.ok) throw new Error('Failed to fetch facility Form 483s and Warning Letters');
  return response.json();
};