export const systemDescriptions: { [key: string]: string } = {
  'Quality Unit': 'Encompasses quality management, documentation, and quality control procedures',
  'Laboratory': 'Covers testing procedures, specifications, and laboratory data management',
  'Production': 'Manufacturing operations, process controls, and validation procedures',
  'Materials': 'Material handling, storage, and inventory management procedures',
  'Facilities & Equipment': 'Facility maintenance, equipment qualification, and environmental controls',
  'Packaging & Labelling': 'Packaging operations, labeling controls, and packaging validation',
  'IT/Data Management': 'Data integrity, computer system validation, and electronic records management'
};

export const subSystemsMapping: { [key: string]: string[] } = {
  'Quality Unit': ['Document Control', 'Quality Control Unit', 'Quality Assurance', 'CAPA Management'],
  'Laboratory': ['Test Methods', 'Stability Program', 'Lab Equipment', 'Method Validation'],
  'Production': ['Process Controls', 'Equipment Maintenance', 'Production Records', 'Process Validation'],
  'Materials': ['Warehouse Management', 'Material Testing', 'Supplier Controls', 'Inventory Management'],
  'Facilities & Equipment': ['Facility Maintenance', 'Equipment Qualification', 'Environmental Monitoring', 'Utilities'],
  'Packaging & Labelling': ['Label Controls', 'Packaging Validation', 'Component Management', 'Artwork Control'],
  'IT/Data Management': ['Data Integrity', 'Computer System Validation', 'Electronic Records', 'Audit Trails']
};