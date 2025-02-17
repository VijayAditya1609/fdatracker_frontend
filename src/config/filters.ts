import { Package, Activity, MapPin, Clock } from 'lucide-react';

export const warningLetterFilters = [
  { 
    name: 'Product Type',
    options: ['All', 'Drugs', 'Biologics', 'Devices', 'Tobacco'],
    icon: Package
  },
  {
    name: 'Systems',
    options: [
      'All',
      'Quality Unit',
      'Facilities & Equipment',
      'Production',
      'Laboratory',
      'Materials',
      'Packaging & Labelling',
      'IT/Data Management'
    ],
    icon: Activity
  },
  {
    name: 'Location',
    options: ['All', 'United States', 'India', 'China', 'Europe', 'Other'],
    icon: MapPin
  },
  {
    name: 'Status',
    options: ['All', 'Open', 'Closed'],
    icon: Clock
  }
];