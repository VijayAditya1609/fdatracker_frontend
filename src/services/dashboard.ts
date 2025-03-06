import { api } from '../config/api';
import { authFetch } from './authFetch';
import { getAuthHeaders } from '../config/api';

const POSTGREST_URL = 'https://app.fdatracker.ai:3000';

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
  const response = await fetch(`${POSTGREST_URL}/rpc/fn_dashboard_stats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      p_date_range: dateRange
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch dashboard stats: ${errorText}`);
  }
  
  const data = await response.json();
  
  // The function returns an array with a single object, so we take the first element
  const stats = Array.isArray(data) ? data[0] : data;
  
  return {
    total483: Number(stats.total483),
    converted483: Number(stats.converted483),
    totalInspections: Number(stats.total_inspections)
  };
};

export const getProblematicSubSystems = async (dateRange: string): Promise<ProblematicSubSystem[]> => {
  // Convert dateRange to actual date string
  let dateFilter = '';
  const today = new Date();
  
  switch (dateRange) {
    case '90days':
      dateFilter = new Date(today.setDate(today.getDate() - 90)).toISOString().split('T')[0];
      break;
    case '180days':
      dateFilter = new Date(today.setDate(today.getDate() - 180)).toISOString().split('T')[0];
      break;
    case '365days':
      dateFilter = new Date(today.setDate(today.getDate() - 365)).toISOString().split('T')[0];
      break;
    case 'all':
      dateFilter = '2018-01-01';
      break;
    default:
      dateFilter = new Date(today.setDate(today.getDate() - 90)).toISOString().split('T')[0];
  }

  // Fetch data from the view without date filter since the view doesn't have issue_date column
  const response = await fetch(`${POSTGREST_URL}/subsystems_data_view`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch problematic subsystems: ${errorText}`);
  }

  const rawData = await response.json();

  // Process the data to calculate counts and aggregate information
  const systemMap = new Map<string, {
    system_name: string,
    process_type: string,
    form483_count: number,
    warning_letter_count: number,
    observations: Set<string>,
    top_issues: Map<string, number>
  }>();

  // Process each record
  rawData.forEach((item: any) => {
    const key = `${item.system_name}-${item.process_type}`;
    
    if (!systemMap.has(key)) {
      systemMap.set(key, {
        system_name: item.system_name,
        process_type: item.process_type,
        form483_count: 0,
        warning_letter_count: 0,
        observations: new Set(),
        top_issues: new Map()
      });
    }

    const systemData = systemMap.get(key)!;

    // Count unique Form 483s and Warning Letters
    if (!systemData.observations.has(item.fda_pdf_id)) {
      systemData.observations.add(item.fda_pdf_id);
      if (item.is_warning_letter) {
        systemData.warning_letter_count++;
      } else {
        systemData.form483_count++;
      }
    }

    // Track issues by central words
    if (item.central_word) {
      const currentCount = systemData.top_issues.get(item.central_word) || 0;
      systemData.top_issues.set(item.central_word, currentCount + 1);
    }
  });

  // Convert the map to array and sort by total citations (483s + warning letters)
  const result = Array.from(systemMap.values())
    .map(item => ({
      system_name: item.system_name,
      process_type: item.process_type,
      form483_count: String(item.form483_count),
      warning_letter_count: String(item.warning_letter_count),
      top_issues: JSON.stringify(
        Array.from(item.top_issues.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([issue]) => issue)
      ),
      system_id: item.system_name
    }))
    .sort((a, b) => {
      const totalA = Number(a.form483_count) + Number(a.warning_letter_count);
      const totalB = Number(b.form483_count) + Number(b.warning_letter_count);
      return totalB - totalA;
    })
    .slice(0, 5); // Get top 5 problematic subsystems

  return result;
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
  // Fetch warning letters from PostgREST
  const warningLettersResponse = await fetch(`${POSTGREST_URL}/vw_warning_letters?order=issue_date.desc&limit=5`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Fetch Form 483s from PostgREST
  const form483Response = await fetch(`${POSTGREST_URL}/vw_form_483?order=issue_date.desc&limit=5`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!warningLettersResponse.ok) {
    throw new Error('Failed to fetch warning letters');
  }

  if (!form483Response.ok) {
    throw new Error('Failed to fetch Form 483s');
  }

  const warningLettersData = await warningLettersResponse.json();
  const form483Data = await form483Response.json();

  // Transform warning letters data to match FDAAction interface
  const warningLetters = warningLettersData.map((wl: any) => ({
    id: wl.id,
    type: 'Warning Letter',
    facilityName: wl.facility_name,
    companyName: wl.company_name,
    location: wl.location,
    issueDate: wl.issue_date,
    systems: wl.systems || [],
    status: wl.has_form_483
  }));

  // Transform Form 483 data to match FDAAction interface
  const form483s = form483Data.map((f483: any) => ({
    id: f483.id,
    type: 'Form 483',
    facilityName: f483.facility_name,
    companyName: f483.company_name,
    location: f483.location,
    issueDate: f483.issue_date,
    systems: f483.systems || [],
    status: f483.has_warning_letter,
    numOfObservations: parseInt(f483.num_of_observations) || 0
  }));

  // Combine and sort both types of actions by issue date
  const allActions = [...warningLetters, ...form483s]
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 10); // Limit to 10 most recent actions

  return allActions;
};
