export interface SubSystemData {
  form483Count: number;
  warningLetterCount: number;
  totalCount: number;
}

export interface SystemData {
  systemId: number;
  systemName: string;
  subSystems: {
    [key: string]: SubSystemData;
  };
}

export interface SixSystemsResponse {
  [key: string]: SystemData;
}

export interface TopSubSystem {
  name: string;
  count: number;
}

export interface SubSystem {
  name: string;
  count: number;
  description?: string;
}

export interface ProcessedSystem {
  id: string;
  name: string;
  description: string;
  form483Count: number;
  warningLetterCount: number;
  totalCount: number;
  topSubSystems: SubSystem[];
  allSubSystems?: SubSystem[];
  trend?: 'up' | 'down';
  trendValue?: string;
}

export interface Form483 {
  company_affected: string;
  feinumber: string;  
  converted_to_wl: string;
  issue_date: string;
  id: string;
  producttype: string;
  wl_analysis?: string;
}

export interface Investigator {
  investigator_name: string;
  investigator_id: string;
  count_wl: string;
  count_483: string;
}

export interface Facility {
  feinumber: string;
  cnt483: string;
  name: string;
  countryname: string;
  cntwl: string;
  id: string;
}

export interface Observation {
  company_affected: string;
  is_escalated: string;
  issue_date: string;
  pdf_id: string;
  excerpt_from_observation: string;
  justification: string;
  id: string;
  observation_title: string;
}

export interface SubSystemReport {
  Form483s: Form483[];
  topInvestigators: Investigator[];
  topFacilities: Facility[];
  observationList: Observation[];
  violationList: any[];
  processTypesCheckList: any[];
  total483sIssued: number;
  total483sConverted: number;
  totalObservations: number;
  totalViolations: number;
  processTypeEscalationCount: number;
}

export interface SystemReport {
  systemId: number;
  systemName: string;
  systemTotal483sIssued: number;
  systemTotal483sConverted: number;
  subSystems: {
    [key: string]: SubSystemReport;
  };
}