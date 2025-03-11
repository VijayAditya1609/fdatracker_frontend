import { api } from '../config/api';
import { SystemReport, SubSystemReport } from '../types/system';
import { auth } from './auth';
import { authFetch } from './authFetch';

export async function getSystemReport(systemId: string, dateRange: string = 'all'): Promise<SystemReport> {
  const response = await authFetch(`${api.systemsDetail}?system_id=${systemId}&date_range=${dateRange}`);

  
  if (!response.ok) {
    if (response.status === 401) {
      auth.logout(); // Session expired or invalid token
      throw new Error('Session expired. Please login again.');
    }
    throw new Error('Failed to fetch system report');
  }

  return response.json();
}

export async function getSubSystemReport(processType: string, dateRange: string = 'all'): Promise<SubSystemReport> {
  const response = await authFetch(`${api.subSystemReport}?subSystems=${encodeURIComponent(processType)}&date_range=${dateRange}`);

  
  if (!response.ok) {
    if (response.status === 401) {
      auth.logout();
      throw new Error('Session expired. Please login again.');
    }
    throw new Error('Failed to fetch subsystem report');
  }

  return response.json();
} 