export interface ProcessTypeAffected {
  id: number;
  processType: string;
  keyObservation: string;
  failureCause: string;
  correctiveAction: string;
  preventiveAction: string;
  excerptFromViolation: string;
  justification: string;
  violationId: number;
}

export interface Violation {
  id: number;
  violationNumber: number;
  violationTitle: string | null;
  violationText: string | null;
  wlId: number;
  violationAnalysis: boolean;
  summary: string;
  cfrCode: string;
  recommendation: string | null;
  process_types_affected: ProcessTypeAffected[];
  linked_observation_list: any[];
}

export interface WarningLetterDetails {
  id: number;
  documentType: string;
  companyAffected: string;
  countryOfTheIssue: string;
  addressOfTheIssue: string;
  date: string;
  investigators: string[] | null;
  companyContacts: string[] | null;
  productTypes: string[] | null;
  feinumber: string | null;
  linked483Id: number | null;
  url: string;
  letterCount: number;
  violations: Violation[];
}

export interface WarningLetterResponse {
  summaryWL: string;
  warningLetterDetails: WarningLetterDetails;
  facilityId: number;
}