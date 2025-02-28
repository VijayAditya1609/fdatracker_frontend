import { api } from '../config/api';
import { authFetch } from './authFetch';

export interface DashboardStats {
  total483: number;
  converted483: number;
  totalInspections: number;
}

export interface ProblematicSubSystem {
  warning_letter_count: string;
  system_name: string;
  form483_count: string;
  process_type: string;
  top_issues: string;
  system_id: string;
}

export interface YearlyTrend {
  count_warning_letters: string;
  issue_year: string;
  count_483s: string;
}

export interface SystemCount {
  count_warning_letters: string;
  system_name: string;
  count_483s: string;
}

export interface TopInvestigator {
  warning_letter_count: string;
  investigator_name: string;
  latest_issue_date: string;
  id: string;
  investigator_count: string;
  conversion_rate: string;
  activity_status: string;
}

export interface FDAAction {
  id: number;
  type: string;
  facilityName: string;
  companyName: string | null;
  location: string;
  issueDate: string;
  systems: string[];
  status: boolean;
}

export const getDashboardStats = async (dateRange: string): Promise<DashboardStats> => {
  const response = await authFetch(`${api.dashboardStats}?date_range=${dateRange}`);

  if (!response.ok) throw new Error('Failed to fetch dashboard stats');
  const data = await response.json();
  return {
    total483: Number(data.total483),
    converted483: Number(data.converted483),
    totalInspections: Number(data.totalInspections)
  };
};

export const getProblematicSubSystems = async (dateRange: string): Promise<ProblematicSubSystem[]> => {
  const response = await authFetch(`${api.problematicSubSystems}?date_range=${dateRange}`);
  if (!response.ok) throw new Error('Failed to fetch problematic subsystems');
  return response.json();
};

export const getYearlyTrend = async (dateRange: string): Promise<YearlyTrend[]> => {
  const response = await authFetch(`${api.yearlyTrend}?date_range=${dateRange}`);
  if (!response.ok) throw new Error('Failed to fetch yearly trend');
  return response.json();
};

export const getSystemCounts = async (dateRange: string): Promise<SystemCount[]> => {
  const response = await authFetch(`${api.systemCounts}?date_range=${dateRange}`);

  if (!response.ok) throw new Error('Failed to fetch system counts');
  return response.json();
};

export const getTopInvestigators = async (): Promise<TopInvestigator[]> => {
  const response = await authFetch(`${api.topInvestigators}`);
  if (!response.ok) throw new Error('Failed to fetch top investigators');
  return response.json();
};

export const getRecentFDAActions = async (): Promise<FDAAction[]> => {
  const response = await authFetch(`${api.recentFDAActions}`);
  if (!response.ok) throw new Error('Failed to fetch recent FDA actions');
  return response.json();
};