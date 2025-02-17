import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, ChevronDown } from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import useDocumentTitle from '../hooks/useDocumentTitle';

const eirs = [
  {
    id: 'EIR-2024-001',
    facilityName: 'PharmaCorp Manufacturing',
    feiNumber: '3002123456',
    location: 'Boston, MA, USA',
    productType: 'Drug Product',
    inspectionDates: '2024-03-01 to 2024-03-05',
    inspectionType: 'Surveillance',
    systemsCovered: ['Quality System', 'Laboratory Control', 'Production'],
    inspectionOutcome: 'VAI',
    investigators: ['John Smith', 'Sarah Johnson'],
    followUpRequired: 'Yes',
  },
  {
    id: 'EIR-2024-002',
    facilityName: 'BioTech Solutions',
    feiNumber: '3002789012',
    location: 'San Diego, CA, USA',
    productType: 'API',
    inspectionDates: '2024-02-15 to 2024-02-20',
    inspectionType: 'Pre-Approval',
    systemsCovered: ['Quality System', 'Production'],
    inspectionOutcome: 'NAI',
    investigators: ['Michael Brown'],
    followUpRequired: 'No',
  },
];

const filters = [
  {
    name: 'Product Type',
    options: ['All', 'Drug Product', 'API', 'Biologics', 'Medical Device'],
  },
  {
    name: 'Inspection Type',
    options: ['All', 'Surveillance', 'Pre-Approval', 'For-Cause', 'Routine'],
  },
  { name: 'Inspection Outcome', options: ['All', 'NAI', 'VAI', 'OAI'] },
  {
    name: 'Date Range',
    options: ['All', 'Last 30 Days', 'Last 90 Days', 'Last Year', 'Custom'],
  },
];

export default function EIRsPage() {
  useDocumentTitle('EIR');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-white">
              Establishment Inspection Reports
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Comprehensive list of FDA EIRs with inspection details and
              outcomes.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button className="btn-secondary flex items-center">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Columns
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search EIRs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 
                       placeholder-gray-400"
            />
          </div>

          {filters.map((filter) => (
            <div key={filter.name} className="relative">
              <select
                className="block w-full pl-4 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                         text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    [filter.name]: e.target.value,
                  }))
                }
              >
                <option value="">{filter.name}</option>
                {filter.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* EIRs Table */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6"
                    >
                      Facility Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      FEI Number
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Product Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Inspection Dates
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Inspection Type
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Outcome
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Systems Covered
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {eirs.map((eir) => (
                    <tr key={eir.id} className="hover:bg-gray-800">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                        <div className="font-medium text-white">
                          {eir.facilityName}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {eir.feiNumber}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-gray-300">{eir.location}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {eir.productType}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {eir.inspectionDates}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {eir.inspectionType}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                          ${
                            eir.inspectionOutcome === 'NAI'
                              ? 'bg-green-400/10 text-green-400'
                              : eir.inspectionOutcome === 'VAI'
                              ? 'bg-yellow-400/10 text-yellow-400'
                              : 'bg-red-400/10 text-red-400'
                          }`}
                        >
                          {eir.inspectionOutcome}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        <div className="flex flex-wrap gap-1">
                          {eir.systemsCovered.map((system) => (
                            <span
                              key={system}
                              className="inline-flex items-center rounded-full bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400"
                            >
                              {system}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button className="text-blue-400 hover:text-blue-300">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
