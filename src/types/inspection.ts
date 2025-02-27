export interface Inspection {
  feinumber: string;
  inspectionid: string;
  legalname: string;
  countryname: string;
  inspectionenddate: string;
  producttype: string;
  classificationcode: string;
  id: string;
}

export interface InspectionFilters {
  country: string[];
  postedCitations: string[];
  classificationCode: string[];
  year: string[];
  productType: string[];
}