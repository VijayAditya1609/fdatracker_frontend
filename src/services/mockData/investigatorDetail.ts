import { addDays, subDays } from 'date-fns';

const today = new Date();

export const mockInvestigatorDetail = {
  id: "INV-001",
  investigator_name: "John Smith",
  investigator_count: 156,
  warning_letter_count: 45,
  conversion_rate: "28.8",
  activityStatus: "Active",
  lastIssuedDate: subDays(today, 15).toISOString(),
  
  // Co-investigators data
  coInvestigators: [
    {
      name: "Sarah Johnson",
      inspections: 24,
      form483Count: 18,
      warningLetters: 6
    },
    {
      name: "Michael Brown",
      inspections: 16,
      form483Count: 12,
      warningLetters: 4
    },
    {
      name: "Emily Davis",
      inspections: 12,
      form483Count: 8,
      warningLetters: 3
    }
  ],

  // Form 483s data
  form483s: [
    {
      facilityName: "PharmaCorp Manufacturing Unit 1",
      companyName: "PharmaCorp International",
      location: "Boston, MA",
      issueDate: subDays(today, 15).toISOString(),
      observationCount: 8
    },
    {
      facilityName: "BioTech Solutions Lab",
      companyName: "BioTech Solutions Ltd",
      location: "San Diego, CA",
      issueDate: subDays(today, 45).toISOString(),
      observationCount: 5
    },
    {
      facilityName: "MedTech Sterile Facility",
      companyName: "MedTech Innovations",
      location: "Chicago, IL",
      issueDate: subDays(today, 75).toISOString(),
      observationCount: 6
    }
  ],

  // Subsystems data
  subsystems: [
    {
      name: "Quality System",
      form483Count: 45,
      warningLetterCount: 15,
      totalCount: 60
    },
    {
      name: "Laboratory Control",
      form483Count: 35,
      warningLetterCount: 12,
      totalCount: 47
    },
    {
      name: "Production",
      form483Count: 28,
      warningLetterCount: 8,
      totalCount: 36
    },
    {
      name: "Materials",
      form483Count: 25,
      warningLetterCount: 6,
      totalCount: 31
    }
  ],

  // Facilities data
  facilities: [
    {
      name: "PharmaCorp Manufacturing Unit 1",
      location: "Boston, MA",
      form483Count: 12,
      warningLetterCount: 4
    },
    {
      name: "BioTech Solutions Lab",
      location: "San Diego, CA",
      form483Count: 8,
      warningLetterCount: 2
    },
    {
      name: "MedTech Sterile Facility",
      location: "Chicago, IL",
      form483Count: 10,
      warningLetterCount: 3
    },
    {
      name: "LifeSciences R&D Center",
      location: "Research Triangle, NC",
      form483Count: 6,
      warningLetterCount: 1
    }
  ]
};