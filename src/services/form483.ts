import { api } from '../config/api';
import { auth } from './auth'; 
import { authFetch } from './authFetch';
export interface Form483Response {
  facilityId: number;
  escalatedObservations: any[];
  summary483: {
    summary_483: string;
    observations_summary: {
      observation_number: string;
      observation_summary: string;
    }[];
    pdfId: number;
  };
  form483Details: {
    id: number;
    pdfId: string;
    documentType: string;
    facilityName: string;
    companyName: string | null;
    countryOfTheIssue: string;
    addressOfTheIssue: string;
    issueDate: string;
    createdAt: string | null;
    productType: string | null;
    warningLetterId: number;
    investigators: string[];
    keyObservations: Array<{
      id: number;
      observationNumber: number;
      observationTitle: string | null;
      observationText: string | null;
      process_types_affected: Array<{
        process_type: string;
        key_observation: string;
        root_cause: string;
        corrective_action: string;
        preventive_action: string;
        justification: string;
        excerpt_from_observation: string;
        checklist: Array<{
          question: string;
          potential_failure: string;
          acceptance_criteria: string;
          required_action: string;
          process_type: string;
          process_type_id: number;
          observation_id: number;
        }>;
        observation_id: number;
        isEscalated: boolean;
      }>;
      observation_summary: string;
      pdfId: number;
      isEscalated: boolean;
    }>;
    severity: string | null;
    feinumber: string;
    url: string;
    inspectionDates: string[];
  };
}

export const getForm483Details = async (id: string): Promise<Form483Response> => {
  const response = await authFetch(`${api.form483Detail}?id=${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch Form 483 details');
  }
  return response.json();
};