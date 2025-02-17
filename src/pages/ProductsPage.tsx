import React, { useState } from 'react';
import { Search, SlidersHorizontal, Package, Building2, ChevronDown } from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';

const products = [
  {
    id: 'PROD-2024-001',
    name: 'Drug XYZ 50mg Tablets',
    companyName: 'PharmaCorp International',
    facilityName: 'Manufacturing Site A',
    type: 'Drug Product',
    category: 'Oral Solid',
    applicationNumber: 'NDA123456',
    approvalStatus: 'Approved',
    marketStatus: 'Active',
    lastInspection: '2024-01-15',
    qualityScore: 92,
    riskLevel: 'Low',
    recalls: 0
  },
  {
    id: 'PROD-2024-002',
    name: 'API ABC',
    companyName: 'BioTech Solutions Ltd',
    facilityName: 'R&D Center',
    type: 'API',
    category: 'Chemical',
    applicationNumber: 'DMF987654',
    approvalStatus: 'Under Review',
    marketStatus: 'Pending',
    lastInspection: '2024-02-20',
    qualityScore: 78,
    riskLevel: 'Medium',
    recalls: 1
  }
];

const filters = [
  { name: 'Product Type', options: ['All', 'Drug Product', 'API', 'Biologics', 'Medical Device'] },
  { name: 'Category', options: ['All', 'Oral Solid', 'Injectable', 'Topical', 'Chemical', 'Biological'] },
  { name: 'Approval Status', options: ['All', 'Approved', 'Under Review', 'Rejected'] },
  { name: 'Risk Level', options: ['All', 'High', 'Medium', 'Low'] },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-white">Products</h1>
            <p className="mt-2 text-sm text-gray-400">
              Comprehensive list of products with approval status and quality metrics.
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
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
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, [filter.name]: e.target.value }))}
              >
                <option value="">{filter.name}</option>
                {filter.options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Products Table */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                      Product Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Company
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Facility
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Application #
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Quality Score
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Risk Level
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                      Recalls
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-800">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium text-white">{product.name}</div>
                            <div className="text-sm text-gray-400">{product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-gray-300">{product.companyName} </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {product.facilityName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {product.type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {product.applicationNumber}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                          ${product.approvalStatus === 'Approved' ? 'bg-green-400/10 text-green-400' :
                            product.approvalStatus === 'Under Review' ? 'bg-yellow-400/10 text-yellow-400' :
                            'bg-red-400/10 text-red-400'}`}>
                          {product.approvalStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-600 rounded-full h-1.5 mr-2">
                            <div 
                              className={`h-1.5 rounded-full ${
                                product.qualityScore >= 80 ? 'bg-green-500' :
                                product.qualityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${product.qualityScore}%` }}
                            />
                          </div>
                          <span className="text-gray-300">{product.qualityScore}%</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                          ${product.riskLevel === 'Low' ? 'bg-green-400/10 text-green-400' :
                            product.riskLevel === 'Medium' ? 'bg-yellow-400/10 text-yellow-400' :
                            'bg-red-400/10 text-red-400'}`}>
                          {product.riskLevel} Risk
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                          ${product.recalls === 0 ? 'bg-green-400/10 text-green-400' :
                            product.recalls === 1 ? 'bg-yellow-400/10 text-yellow-400' :
                            'bg-red-400/10 text-red-400'}`}>
                          {product.recalls} Recalls
                        </span>
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