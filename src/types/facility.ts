export interface FacilityResponse {
  id: string;
  facility_name: string;
  feinumber: string;
  country: string;
  address: string;
  business_operations: string;
  count_wl: string;
  count_inspections: string;
  count_483: string;
  top_process_types: string;
}

export interface Facility {
  id: string;
  name: string;
  companyName: string;
  feiNumber: string;
  location: string;
  coordinates: [number, number];
  type: string;
  productTypes: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
  lastInspection: string;
  complianceScore: number;
  systemsCovered: string[];
  inspectionHistory: {
    total: number;
    nai: number;
    vai: number;
    oai: number;
  };
  businessOperations: string;
  countWL: number;
  countInspections: number;
  count483: number;
  topProcessTypes: string[];
}