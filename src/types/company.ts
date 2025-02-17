export interface Company {
  id: string;
  company_name: string;
  count_wl: string;
  count_inspections: string;
  count_483: string;
  active_facilities: string;
}

export interface CompanyOverview {
  facility_count: string;
  inspections_count: string;
  form483_count: string;
  // active_facilities: string;
}
