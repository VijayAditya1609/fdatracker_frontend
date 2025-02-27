export interface InvestigatorListItem {
  id: string;
  investigator_name: string;
  warning_letter_count: string;
  investigator_count: string;
  conversion_rate: string;
  activityStatus: string;
  lastIssuedDate?: string;
}

export interface InvestigatorListResponse {
  data: InvestigatorListItem[];
  recordsFiltered: number;
  recordsTotal: number;
  status: string;
}
