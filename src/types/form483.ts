export interface ProcessTypeAffected {
  process_type: string;
  key_observation: string;
  root_cause: string;
  corrective_action: string;
  preventive_action: string;
  justification: string;
  excerpt_from_observation: string;
  checklist: ChecklistItem[];
  observation_id: number;
  isEscalated: boolean;
}

export interface ChecklistItem {
  question: string;
  potential_failure: string;
  acceptance_criteria: string;
  required_action: string;
  process_type: string;
  process_type_id: number;
  observation_id: number;
}

export interface Form483Observation {
  id: number;
  observationNumber: number;
  observationTitle: string | null;
  observationText: string | null;
  process_types_affected: ProcessTypeAffected[];
  observation_summary: string;
  pdfId: number;
  isEscalated: boolean;
}

export interface Form483Summary {
  summary_483: string;
  observations_summary: {
    observation_number: string;
    observation_summary: string;
  }[];
  pdfId: number;
}