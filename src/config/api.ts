import { auth } from "../services/auth";

export const API_BASE_URL = 'https://app.fdatracker.ai:9443';   //https://app.fdatracker.ai:9443
export const api = {
  // Auth endpoints
  signup: `${API_BASE_URL}/signUp`,
  login: `${API_BASE_URL}/api/login`,
  signupVerify: `${API_BASE_URL}/api/signup/verify`,
  signupProgress: `${API_BASE_URL}/api/signup-progress`,
  forgotPassword: `${API_BASE_URL}/api/forgot-password`,
  resetPassword: `${API_BASE_URL}/api/reset-password`,
  
  // Form 483 endpoints
  form483List: `${API_BASE_URL}/api/483List`,
  form483Detail: `${API_BASE_URL}/api/483Detail`,
  form483Request: `${API_BASE_URL}/api/form483-request`,
  observationDetail: `${API_BASE_URL}/api/ObservationDetail`,
  AuditReadinessChecklistForm483: `${API_BASE_URL}/api/AuditReadinessCheckListFor483`,
  
  // Warning Letter endpoints
  warningLettersList: `${API_BASE_URL}/api/WlList`,
  warningLetterDetail: `${API_BASE_URL}/api/WLDetail`,
  violationDetail: `${API_BASE_URL}/api/ViolationDetail`,
  
  // Company endpoints
  companiesList: `${API_BASE_URL}/api/companiesList`,
  companyStatsData: `${API_BASE_URL}/api/companyStatsData`,
  companyChartsData: `${API_BASE_URL}/api/companyChartsData`,
  companyInspections: `${API_BASE_URL}/api/companyInspections`,
  companyFacilitiesData: `${API_BASE_URL}/api/companyFacilitiesData`,

  
  // Filter endpoints
  filters: `${API_BASE_URL}/getFilters`,
  
  // System endpoints
  sixSystemsList: `${API_BASE_URL}/api/SixSystemsList`,
  systemsDetail: `${API_BASE_URL}/api/systemReport`,
  subSystemReport: `${API_BASE_URL}/api/subSystemReport`,
  processChecklist: `${API_BASE_URL}/api/AuditReadinessCheckListForSubSystem`,
  
  // Inspection endpoints
  inspectionsList: `${API_BASE_URL}/api/InspectionList`,
  inspectionDetail: `${API_BASE_URL}/api/InspectionDetail`,
  
  // Facility endpoints
  facilitiesList: `${API_BASE_URL}/api/facilitiesList`,
  facilityDetail: `${API_BASE_URL}/api/facilityDetail`,
  AuditReadinessCheckListForFacility: `${API_BASE_URL}/api/AuditReadinessCheckListForFacility`,
  // Search endpoints
  search: `${API_BASE_URL}/getFilters`,
  searchData: `${API_BASE_URL}/api/searchData`,
  
  // Investigator endpoints
  investigatorsList: `${API_BASE_URL}/api/investigatorsList`,
  investigatorReport: `${API_BASE_URL}/api/investigatorReport`,
  countOfSubSystemByInvestigator: `${API_BASE_URL}/api/countOfSubSystemByInvestigator`,
  investigatorInspections: `${API_BASE_URL}/api/investigatorInspections`,
  investigatorOverview: `${API_BASE_URL}/api/investigatorsOverview`,
  coInvestigators: `${API_BASE_URL}/api/coInvestigators`,

  //Dashboard Endpoints
  dashboardStats: `${API_BASE_URL}/api/dashboard/Stats`,
  problematicSubSystems: `${API_BASE_URL}/api/dashboard/ProblematicSubSystems`,
  yearlyTrend: `${API_BASE_URL}/api/dashboard/YearlyTrend`,
  systemCounts: `${API_BASE_URL}/api/dashboard/CountBySystems`,
  topInvestigators: `${API_BASE_URL}/api/dashboard/TopInvestigators`,
  recentFDAActions: `${API_BASE_URL}/api/dashboard/RecentFDAActions`,
  createCheckoutSession: `${API_BASE_URL}/api/create-checkout-session`,
  feedback: `${API_BASE_URL}/api/feedback`,
  viewFile: `${API_BASE_URL}/api/view-file`,
};

export const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Auth headers factory function
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    ...headers,
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// API request helper functions
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = auth.getToken(); // Retrieve the stored JWT
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json', // Ensure JSON headers
      'Authorization': `Bearer ${token}`, // Include JWT token
      ...options.headers, // Merge with existing headers
    },
    credentials: 'include', // Include cookies if needed
    mode: 'cors', // Enable CORS
  });



  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// Auth-specific API helpers
export const authRequest = async (url: string, options: RequestInit = {}) => {
  return apiRequest(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });
};
