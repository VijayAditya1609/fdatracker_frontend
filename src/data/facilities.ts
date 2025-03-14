import { Facility } from '../types/facility';

export const ciplaFacilities: Facility[] = [
  {
    id: 'FAC-CIPLA-001',
    name: 'Cipla Goa Unit I',
    companyName: 'Cipla Limited',
    feiNumber: '3002857321',
    location: 'Verna Industrial Estate, Goa, India',
    coordinates: [73.9490, 15.3911],
    type: 'Manufacturing',
    productTypes: ['Drug Product', 'API'],
    riskLevel: 'Low',
    lastInspection: '2023-11-15',
    complianceScore: 94,
    systemsCovered: ['Quality System', 'Laboratory Control', 'Production', 'Packaging & Labeling'],
    inspectionHistory: { total: 15, nai: 10, vai: 5, oai: 0 },
    businessOperations: 'Manufacturing',
    countWL: 10,
    countInspections: 10,
    count483: 10,
    topProcessTypes: ['Manufacturing', 'Packaging', 'Labeling']
  },
  {
    id: 'FAC-CIPLA-002',
    name: 'Cipla Goa Unit II',
    companyName: 'Cipla Limited',
    feiNumber: '3002857322',
    location: 'Verna Industrial Estate, Goa, India',
    coordinates: [73.9495, 15.3915],
    type: 'Manufacturing',
    productTypes: ['Drug Product'],
    riskLevel: 'Low',
    lastInspection: '2023-10-20',
    complianceScore: 92,
    systemsCovered: ['Quality System', 'Production', 'Packaging & Labeling'],
    inspectionHistory: { total: 12, nai: 8, vai: 4, oai: 0 },
    businessOperations: 'Manufacturing',
    countWL: 10,
    countInspections: 10,
    count483: 10,
    topProcessTypes: ['Manufacturing', 'Packaging', 'Labeling']
  },
  {
    id: 'FAC-CIPLA-003',
    name: 'Cipla Kurkumbh Unit I',
    companyName: 'Cipla Limited',
    feiNumber: '3002857323',
    location: 'Kurkumbh MIDC, Maharashtra, India',
    coordinates: [74.3145, 18.3500],
    type: 'API Manufacturing',
    productTypes: ['API'],
    riskLevel: 'Medium',
    lastInspection: '2023-09-10',
    complianceScore: 87,
    systemsCovered: ['Quality System', 'Laboratory Control', 'Production'],
    inspectionHistory: { total: 10, nai: 6, vai: 3, oai: 1 },
    businessOperations: 'Manufacturing',
    countWL: 10,
    countInspections: 10,
    count483: 10,
    topProcessTypes: ['Manufacturing', 'Packaging', 'Labeling']
  },
  {
    id: 'FAC-CIPLA-004',
    name: 'Cipla Kurkumbh Unit II',
    companyName: 'Cipla Limited',
    feiNumber: '3002857324',
    location: 'Kurkumbh MIDC, Maharashtra, India',
    coordinates: [74.3150, 18.3505],
    type: 'API Manufacturing',
    productTypes: ['API'],
    riskLevel: 'Low',
    lastInspection: '2023-12-05',
    complianceScore: 91,
    systemsCovered: ['Quality System', 'Laboratory Control', 'Production'],
    inspectionHistory: { total: 8, nai: 6, vai: 2, oai: 0 },
    businessOperations: 'Manufacturing',
    countWL: 10,
    countInspections: 10,
    count483: 10,
    topProcessTypes: ['Manufacturing', 'Packaging', 'Labeling']
  },
  {
    id: 'FAC-CIPLA-005',
    name: 'Cipla Patalganga Plant',
    companyName: 'Cipla Limited',
    feiNumber: '3002857325',
    location: 'Patalganga, Maharashtra, India',
    coordinates: [73.1755, 18.9123],
    type: 'Manufacturing',
    productTypes: ['Drug Product'],
    riskLevel: 'Low',
    lastInspection: '2023-08-15',
    complianceScore: 95,
    systemsCovered: ['Quality System', 'Production', 'Packaging & Labeling'],
    inspectionHistory: { total: 14, nai: 11, vai: 3, oai: 0 },
    businessOperations: 'Manufacturing',
    countWL: 10,
    countInspections: 10,
    count483: 10,
    topProcessTypes: ['Manufacturing', 'Packaging', 'Labeling']
  },
  {
    id: 'FAC-CIPLA-006',
    name: 'Cipla Bangalore R&D Center',
    companyName: 'Cipla Limited',
    feiNumber: '3002857326',
    location: 'Bangalore, Karnataka, India',
    coordinates: [77.5946, 12.9716],
    type: 'R&D',
    productTypes: ['Drug Product', 'API'],
    riskLevel: 'Low',
    lastInspection: '2023-07-20',
    complianceScore: 96,
    systemsCovered: ['Laboratory Control', 'Research & Development'],
    inspectionHistory: { total: 6, nai: 5, vai: 1, oai: 0 },
    businessOperations: 'Manufacturing',
    countWL: 10,
    countInspections: 10,
    count483: 10,
    topProcessTypes: ['Manufacturing', 'Packaging', 'Labeling']
  },
  {
    id: 'FAC-CIPLA-007',
    name: 'Cipla Sikkim Unit I',
    companyName: 'Cipla Limited',
    feiNumber: '3002857327',
    location: 'Sikkim, India',
    coordinates: [88.5122, 27.3516],
    type: 'Manufacturing',
    productTypes: ['Drug Product'],
    riskLevel: 'Medium',
    lastInspection: '2023-06-10',
    complianceScore: 88,
    systemsCovered: ['Quality System', 'Production', 'Packaging & Labeling'],
    inspectionHistory: { total: 9, nai: 5, vai: 4, oai: 0 },
    businessOperations: 'Manufacturing',
    countWL: 10,
    countInspections: 10,
    count483: 10,
    topProcessTypes: ['Manufacturing', 'Packaging', 'Labeling']
  },
  {
    id: 'FAC-CIPLA-008',
    name: 'Cipla Sikkim Unit II',
    companyName: 'Cipla Limited',
    feiNumber: '3002857328',
    location: 'Sikkim, India',
    coordinates: [88.5127, 27.3521],
    type: 'Manufacturing',
    productTypes: ['Drug Product'],
    riskLevel: 'Low',
    lastInspection: '2023-11-25',
    complianceScore: 93,
    systemsCovered: ['Quality System', 'Production', 'Packaging & Labeling'],
    inspectionHistory: { total: 7, nai: 5, vai: 2, oai: 0 },
    businessOperations: 'Manufacturing',
    countWL: 10,
    countInspections: 10,
    count483: 10,
    topProcessTypes: ['Manufacturing', 'Packaging', 'Labeling']
  },
  {
    id: 'FAC-CIPLA-009',
    name: 'Cipla Indore SEZ',
    companyName: 'Cipla Limited',
    feiNumber: '3002857329',
    location: 'Indore SEZ, Madhya Pradesh, India',
    coordinates: [75.8577, 22.7196],
    type: 'Manufacturing',
    productTypes: ['Drug Product', 'API'],
    riskLevel: 'Low',
    lastInspection: '2023-10-05',
    complianceScore: 94,
    systemsCovered: ['Quality System', 'Laboratory Control', 'Production'],
    inspectionHistory: { total: 11, nai: 8, vai: 3, oai: 0 },
    businessOperations: 'Manufacturing',
    countWL: 10,
    countInspections: 10,
    count483: 10,
    topProcessTypes: ['Manufacturing', 'Packaging', 'Labeling']
  },
  {
    id: 'FAC-CIPLA-010',
    name: 'Cipla Baddi Unit',
    companyName: 'Cipla Limited',
    feiNumber: '3002857330',
    location: 'Baddi, Himachal Pradesh, India',
    coordinates: [76.7919, 30.9579],
    type: 'Manufacturing',
    productTypes: ['Drug Product'],
    riskLevel: 'Medium',
    lastInspection: '2023-09-20',
    complianceScore: 86,
    systemsCovered: ['Quality System', 'Production', 'Packaging & Labeling'],
    inspectionHistory: { total: 13, nai: 7, vai: 5, oai: 1 },
    businessOperations: 'Manufacturing',
    countWL: 10,
    countInspections: 10,
    count483: 10,
    topProcessTypes: ['Manufacturing', 'Packaging', 'Labeling']
  },
  // ... Adding more facilities with similar pattern
  {
    id: 'FAC-CIPLA-011',
    name: 'Cipla Uganda Limited',
    companyName: 'Cipla Limited',
    feiNumber: '3002857331',
    location: 'Kampala, Uganda',
    coordinates: [32.5899, 0.3476],
    type: 'Manufacturing',
    productTypes: ['Drug Product'],
    riskLevel: 'Medium',
    lastInspection: '2023-08-10',
    complianceScore: 85,
    systemsCovered: ['Quality System', 'Production'],
    inspectionHistory: { total: 8, nai: 5, vai: 3, oai: 0 },
    businessOperations: 'Manufacturing',
    countWL: 10,
    countInspections: 10,
    count483: 10,
    topProcessTypes: ['Manufacturing', 'Packaging', 'Labeling']
  },
  // Continue with more facilities...
  {
    id: 'FAC-CIPLA-050',
    name: 'Cipla South Africa',
    companyName: 'Cipla Limited',
    feiNumber: '3002857370',
    location: 'Durban, South Africa',
    coordinates: [31.0218, -29.8587],
    type: 'Manufacturing',
    productTypes: ['Drug Product'],
    riskLevel: 'Low',
    lastInspection: '2023-12-15',
    complianceScore: 92,
    systemsCovered: ['Quality System', 'Production', 'Packaging & Labeling'],
    inspectionHistory: { total: 10, nai: 7, vai: 3, oai: 0 },
    businessOperations: 'Manufacturing',
    countWL: 10,
    countInspections: 10,
    count483: 10,
    topProcessTypes: ['Manufacturing', 'Packaging', 'Labeling']
  }
];

// Helper function to get facilities by company
export const getFacilitiesByCompany = (companyName: string): Facility[] => {
  return ciplaFacilities.filter(facility => facility.companyName === companyName);
};

// Helper function to get facility by ID
export const getFacilityById = (facilityId: string): Facility | undefined => {
  return ciplaFacilities.find(facility => facility.id === facilityId);
};