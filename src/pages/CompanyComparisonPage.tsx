// import React, { useState, useEffect } from 'react';
// import DashboardLayout from '../components/layouts/DashboardLayout';
// import CompanySelector from '../components/comparison/CompanySelector';
// import ComparisonMetrics from '../components/comparison/ComparisonMetrics';
// import InspectionHistory from '../components/comparison/InspectionHistory';
// import RegulatoryTimeline from '../components/comparison/RegulatoryTimeline';
// import useDocumentTitle from '../hooks/useDocumentTitle';
// import { getCompanyOptions, getCompanyMetrics } from '../services/companyComparison';
// import { CompanyOption, CompanyMetrics } from '../types/companyComparison';
// import Alert from '../components/common/Alert';

// // Default company IDs for Cipla, Sun Pharma, and Dr Reddy's
// const DEFAULT_COMPANY_IDS = ['650', '2161', '2875'];

// export default function CompanyComparisonPage() {
//   useDocumentTitle('Company Comparison');
//   const currentYear = new Date().getFullYear().toString();
  
//   const [companies, setCompanies] = useState<CompanyOption[]>([]);
//   const [selectedCompanies, setSelectedCompanies] = useState<CompanyOption[]>([]);
//   const [companyMetrics, setCompanyMetrics] = useState<Record<string, CompanyMetrics>>({});
//   const [fromYear, setFromYear] = useState('2020');
//   const [toYear, setToYear] = useState(currentYear);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch company options and set default selections
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         setIsLoading(true);
//         const data = await getCompanyOptions();
//         setCompanies(data);
        
//         // Set default selected companies
//         const defaultCompanies = data.filter(company => 
//           DEFAULT_COMPANY_IDS.includes(company.id)
//         );
//         setSelectedCompanies(defaultCompanies);
//       } catch (err) {
//         setError('Failed to load companies');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCompanies();
//   }, []);

//   // Fetch metrics for selected companies
//   useEffect(() => {
//     const fetchMetrics = async () => {
//       try {
//         const metrics: Record<string, CompanyMetrics> = {};
        
//         for (const company of selectedCompanies) {
//           const data = await getCompanyMetrics(company.id, fromYear, toYear);
//           metrics[company.id] = data;
//         }
        
//         setCompanyMetrics(metrics);
//       } catch (err) {
//         setError('Failed to load company metrics');
//       }
//     };

//     if (selectedCompanies.length > 0) {
//       fetchMetrics();
//     }
//   }, [selectedCompanies, fromYear, toYear]);

//   const handleSelectCompany = (company: CompanyOption) => {
//     if (selectedCompanies.length < 4) {
//       setSelectedCompanies([...selectedCompanies, company]);
//     }
//   };

//   const handleRemoveCompany = (companyId: string) => {
//     setSelectedCompanies(selectedCompanies.filter(company => company.id !== companyId));
//     const newMetrics = { ...companyMetrics };
//     delete newMetrics[companyId];
//     setCompanyMetrics(newMetrics);
//   };

//   const handleYearChange = (type: 'from' | 'to', value: string) => {
//     if (type === 'from') {
//       setFromYear(value);
//     } else {
//       setToYear(value);
//     }
//   };

//   if (error) {
//     return (
//       <DashboardLayout>
//         <div className="px-4 sm:px-6 lg:px-8 py-8">
//           <Alert type="error" message={error} />
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="px-4 sm:px-6 lg:px-8 py-8">
//         <div className="sm:flex sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-semibold text-white">Company Comparison</h1>
//             <p className="mt-2 text-sm text-gray-400">
//               Compare regulatory compliance metrics and performance across pharmaceutical companies
//             </p>
//           </div>
//         </div>

//         <div className="mt-8 space-y-8">
//           <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
//             <CompanySelector
//               companies={companies}
//               selectedCompanies={selectedCompanies}
//               onSelectCompany={handleSelectCompany}
//               onRemoveCompany={handleRemoveCompany}
//               isLoading={isLoading}
//             />

//             <div className="mt-6 flex items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-gray-400">From:</span>
//                 <select
//                   value={fromYear}
//                   onChange={(e) => handleYearChange('from', e.target.value)}
//                   className="bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-300 px-3 py-2"
//                 >
//                   {Array.from({ length: currentYear - 2009 }, (_, i) => (
//                     <option key={2010 + i} value={2010 + i}>
//                       {2010 + i}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="flex items-center gap-2">
//                 <span className="text-sm text-gray-400">To:</span>
//                 <select
//                   value={toYear}
//                   onChange={(e) => handleYearChange('to', e.target.value)}
//                   className="bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-300 px-3 py-2"
//                 >
//                   {Array.from({ length: currentYear - 2009 }, (_, i) => (
//                     <option key={2010 + i} value={2010 + i}>
//                       {2010 + i}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>

//           {selectedCompanies.length > 0 && (
//             <>
//               <ComparisonMetrics 
//                 selectedCompanies={selectedCompanies} 
//                 metrics={companyMetrics}
//               />
//               <InspectionHistory 
//                 selectedCompanies={selectedCompanies} 
//                 metrics={companyMetrics}
//               />
//               <RegulatoryTimeline 
//                 selectedCompanies={selectedCompanies} 
//                 metrics={companyMetrics}
//               />
//             </>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }