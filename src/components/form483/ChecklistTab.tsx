import React, { useState } from 'react';
import { Activity, AlertCircle, CheckCircle, Target, ArrowRight, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Form483Observation } from '../../types/form483';

interface ChecklistTabProps {
  observations: Form483Observation[];
}

export default function ChecklistTab({ observations }: ChecklistTabProps) {
  const [selectedProcessType, setSelectedProcessType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get all unique process types
  const processTypes = Array.from(new Set(
    observations.flatMap(obs => 
      obs.process_types_affected.map(type => type.process_type)
    )
  ));

  // Get all checklist items with their context
  const allChecklistItems = observations.flatMap(obs => 
    obs.process_types_affected.flatMap(processType => 
      processType.checklist.map(item => ({
        ...item,
        observationNumber: obs.observationNumber,
        processType: processType.process_type,
        key_observation: processType.key_observation
      }))
    )
  );

  // Filter checklist items based on process type and search query
  const filteredItems = allChecklistItems.filter(item => {
    const matchesProcessType = !selectedProcessType || item.processType === selectedProcessType;
    const matchesSearch = !searchQuery || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.acceptance_criteria.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.required_action.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProcessType && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // Calculate statistics
  const totalChecklist = allChecklistItems.length;
  const totalProcessTypes = processTypes.length;
  const averagePerObservation = (totalChecklist / observations.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Total Checklist Items</div>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">{totalChecklist}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Sub-systems</div>
            <Activity className="h-5 w-5 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">{totalProcessTypes}</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Average per Observation</div>
            <Target className="h-5 w-5 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">{averagePerObservation}</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search checklist items..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                     text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          className="bg-gray-700 border border-gray-600 rounded-lg text-gray-300 px-4 py-2"
          value={selectedProcessType || ''}
          onChange={(e) => {
            setSelectedProcessType(e.target.value || null);
            setCurrentPage(1); // Reset to first page on filter change
          }}
        >
          <option value="">All Sub-systems</option>
          {processTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Checklist Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Observation
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                 Sub-System
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Question
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Acceptance Criteria
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Required Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {paginatedItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="inline-flex items-center rounded-full bg-blue-400/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                    {item.observationNumber}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="inline-flex items-center rounded-full bg-purple-400/10 px-2.5 py-1 text-xs font-medium text-purple-400">
                    {item.processType}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {item.question}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {item.acceptance_criteria}
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  {item.required_action}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredItems.length)} of {filteredItems.length} items
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}