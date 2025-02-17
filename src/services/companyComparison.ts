import { CompanyOption, CompanyMetrics } from '../types/companyComparison';

const BASE_URL = 'https://app.fdatracker.ai:9443/api';

export const getCompanyOptions = async (): Promise<CompanyOption[]> => {
  try {
    const response = await fetch(`${BASE_URL}/ComanyDropdown`);
    if (!response.ok) throw new Error('Failed to fetch company options');
    return response.json();
  } catch (error) {
    console.error('Error fetching company options:', error);
    throw error;
  }
};

export const getCompanyMetrics = async (
  companyId: string,
  fromYear: string,
  toYear: string
): Promise<CompanyMetrics> => {
  try {
    const response = await fetch(
      `${BASE_URL}/companyStats?companyId=${companyId}&fromYear=${fromYear}&toYear=${toYear}`
    );
    if (!response.ok) throw new Error('Failed to fetch company metrics');
    return response.json();
  } catch (error) {
    console.error('Error fetching company metrics:', error);
    throw error;
  }
};