import React, { useState } from 'react';
import { Calendar, AlertCircle, Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Form483 } from '../../../types/system';

interface Form483ListProps {
  form483s: Form483[];
}

export default function Form483List({ form483s }: Form483ListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'company' | 'feinumber'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterProductType, setFilterProductType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'converted' | 'form483'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique product types
  const productTypes = ['all', ...new Set(form483s.map(f => f.producttype))];

  // Sort data based on sortBy and sortOrder
  const sortData = (data: Form483[]) => {
    return data.sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'date') {
        return (
          order * (new Date(a.issue_date).getTime() - new Date(b.issue_date).getTime())
        );
      }
      if (sortBy === 'company') {
        return order * a.company_affected.localeCompare(b.company_affected);
      }
      if (sortBy === 'feinumber') {
        return order * a.feinumber.localeCompare(b.feinumber);
      }
      return 0;
    });
  };

  // Filter, sort, and paginate form483s
  const filteredForm483s = sortData(
    form483s.filter(form => {
      const matchesSearch = form.company_affected
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesProductFilter =
        filterProductType === 'all' || form.producttype === filterProductType;
      const matchesStatusFilter =
        filterStatus === 'all' ||
        (filterStatus === 'converted' && form.converted_to_wl === 't') ||
        (filterStatus === 'form483' && form.converted_to_wl !== 't');
      return matchesSearch && matchesProductFilter && matchesStatusFilter;
    })
  );

  const totalPages = Math.ceil(filteredForm483s.length / itemsPerPage);
  const paginatedForm483s = filteredForm483s.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: 'date' | 'company' | 'feinumber') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Add this new function for page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 
                     placeholder-gray-400"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={filterProductType}
            onChange={(e) => setFilterProductType(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg text-white px-4 py-2"
          >
            {productTypes.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Product Types' : type}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'converted' | 'form483')}
            className="bg-gray-700 border border-gray-600 rounded-lg text-white px-4 py-2"
          >
            <option value="all">All Status</option>
            <option value="converted">Converted to WL</option>
            <option value="form483">Form 483</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('feinumber')}
              >
                FEI Number {sortBy === 'feinumber' && (sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />)}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('company')}
              >
                Company {sortBy === 'company' && (sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />)}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => handleSort('date')}
              >
                Date {sortBy === 'date' && (sortOrder === 'asc' ? <ChevronUp /> : <ChevronDown />)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Product Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Form 483 Analysis
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                WL Analysis
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {paginatedForm483s.map((form483) => (
              <tr
                key={form483.id}
                className="hover:bg-gray-700/50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {form483.feinumber || '--'}
                </td>
                <td className="px-6 py-4 ">
                  <div className="text-sm font-medium text-white">
                    {form483.company_affected || '--'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-400">
                    {form483.issue_date
                      ? new Date(form483.issue_date).toLocaleDateString()
                      : '--'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-400">
                    {form483.producttype || '--'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                    ${form483.converted_to_wl === 't' ? 'bg-red-400/10 text-red-400' : 'bg-blue-400/10 text-blue-400'}`}>
                    {form483.converted_to_wl === 't' ? 'Converted to WL' : 'Form 483'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={`/form-483s/${form483.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    Form 483 Analysis
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {form483.wl_analysis ? (
                    <a
                      href={`/warning-letters/${form483.wl_analysis}`}
                      className="flex items-center text-yellow-400 text-sm hover:underline"
                    >
                      WL Analysis
                    </a>
                  ) : (
                    '--'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Replace the existing pagination with this new one */}
      <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Showing <span className="font-medium text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-medium text-white">
            {Math.min(currentPage * itemsPerPage, filteredForm483s.length)}
          </span> of{' '}
          <span className="font-medium text-white">{filteredForm483s.length}</span> entries
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-1">
            {getPageNumbers().map((pageNum, idx) => (
              <button
                key={idx}
                onClick={() => typeof pageNum === 'number' && setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded-lg ${
                  pageNum === '...'
                    ? 'text-gray-400 cursor-default'
                    : pageNum === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${
              currentPage === totalPages
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* No Results */}
      {filteredForm483s.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No Form 483s found matching your search criteria.
        </div>
      )}
    </div>

      </div>
  );
}
