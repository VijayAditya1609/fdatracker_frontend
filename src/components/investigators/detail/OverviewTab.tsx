import React, { useMemo, useState } from 'react';
import { Activity, FileText, AlertTriangle, Clock, Building, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { chartOptions } from '../../../utils/chartOptions';

const ITEMS_PER_PAGE = 10;

interface InvestigatorOverview {
  investigationsByYear: Array<{
    count: string;
    issue_date_year: string;
  }>;
  topSubSystems: Record<string, number>;
  investigatorLocations: Array<{
    name: string;
    location: string;
    issue_date: string;
    id: string;
  }>;
  latestIssueDate: string;
  conversionRate: number;
  countInspections: number;
  countWarningLetter: number;
}

interface OverviewTabProps {
  investigator: InvestigatorOverview;
}

export default function OverviewTab({ investigator }: OverviewTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'name' | 'date'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  console.log('Overview Data:', investigator); // Add this for debugging

  // Process trend data for chart
  const chartData = useMemo(() => {
    if (!investigator?.investigationsByYear?.length) return null;

    const years = investigator.investigationsByYear.map(item => item.issue_date_year);
    const counts = investigator.investigationsByYear.map(item => parseInt(item.count));

    return {
      labels: years,
      datasets: [{
        label: 'Form 483s',
        data: counts,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };
  }, [investigator?.investigationsByYear]);

  // Get top 5 subsystems
  const topSubsystems = useMemo(() => {
    if (!investigator?.topSubSystems) return [];

    return Object.entries(investigator.topSubSystems)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [investigator?.topSubSystems]);

  if (!investigator) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">Loading overview data...</div>
      </div>
    );
  }

  const filteredFacilities = useMemo(() => {
    if (!investigator?.investigatorLocations) return [];

    return [...investigator.investigatorLocations]
      .filter((facility) =>
        facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortField === 'date') {
          // Convert dates to timestamps for comparison
          const dateA = new Date(a.issue_date).getTime();
          const dateB = new Date(b.issue_date).getTime();
          // If dates are equal, use ID as secondary sort to prevent shuffling
          if (dateA === dateB) {
            return sortDirection === 'asc' ?
              a.id.localeCompare(b.id) :
              b.id.localeCompare(a.id);
          }
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        }
        // If sorting by name, use ID as secondary sort when names are equal
        const nameComparison = a.name.localeCompare(b.name);
        if (nameComparison === 0) {
          return sortDirection === 'asc' ?
            a.id.localeCompare(b.id) :
            b.id.localeCompare(a.id);
        }
        return sortDirection === 'asc' ? nameComparison : -nameComparison;
      });
  }, [investigator?.investigatorLocations, searchQuery, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredFacilities.length / ITEMS_PER_PAGE);
  const paginatedFacilities = filteredFacilities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const handleSort = (field: 'name' | 'date') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Always start with desc when changing fields
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Inside OverviewTab component
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = Math.ceil(filteredFacilities.length / ITEMS_PER_PAGE);
    if (totalPages <= 5) {
      // If there are 5 or fewer pages, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, and a range of surrounding pages
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };


  return (
    <div className="space-y-6">
      {/* Key Metrics */}

     

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">Facilities Inspected</div>
          <Building className="h-5 w-5 text-purple-400" />
        </div>
        <div className="mt-2 text-2xl font-semibold text-white">
          {investigator.investigatorLocations?.length || 0}
        </div>
      </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Total Form483s</div>
            <Activity className="h-5 w-5 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">
            {investigator.countInspections}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">warning letter </div>
            <Building className="h-5 w-5 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">
            {investigator.countWarningLetter}
          </div>
        </div>



        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Conversion Rate</div>
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-white">
            {investigator.countInspections > 0
              ? ((investigator.countWarningLetter / investigator.countInspections) * 100).toFixed(1)
              : '0'
            }%
          </div>
          <div className="mt-1 text-xs text-gray-400">
            {`${investigator.countWarningLetter} WL / ${investigator.countInspections} 483s`}
          </div>
        </div>


        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">Last Activity</div>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-2 text-lg font-semibold text-white">
            {investigator.latestIssueDate ?
              new Date(investigator.latestIssueDate).toLocaleDateString() :
              'N/A'
            }
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Inspection Trend */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Form 483 Trend</h3>
          <div className="h-80">
            {chartData ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No trend data available
              </div>
            )}
          </div>
        </div>

        {/* Top 5 Subsystems - Updated Design */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Top 5 Subsystems</h3>
          <div className="space-y-4">
            {topSubsystems.length > 0 ? (
              topSubsystems.map(([name, count]) => (
                <div
                  key={name}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="text-gray-300">{name}</span>
                  </div>
                  <span className="text-blue-400 font-semibold px-3 py-1 rounded-full bg-blue-400/10">
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-gray-400">No subsystems data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Facilities List - Updated Design */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Facilities Inspected</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search facilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 
                 placeholder-gray-400 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th
                  className="pb-3 px-4 text-gray-400 font-medium cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  Facility Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="pb-3 px-4 text-gray-400 font-medium">Facility Location</th>
                <th
                  className="pb-3 px-4 text-gray-400 font-medium text-right cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  Issue Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedFacilities.length > 0 ? (
                paginatedFacilities.map((facility, index) => (
                  <tr
                    key={`${facility.id}-${facility.issue_date}-${index}`} // Ensure the key is unique
                    className="hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="text-white font-medium hover:text-blue-400 cursor-pointer">
                        {facility.name}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-gray-400 text-sm">{facility.location}</div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                        {new Date(facility.issue_date).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-400">
                    No facilities found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3 w-full overflow-hidden">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
            <span className="font-medium text-white">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredFacilities.length)}
            </span> of{' '}
            <span className="font-medium text-white">{filteredFacilities.length}</span> facilities
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${currentPage === 1
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
                  className={`px-3 py-1 rounded-lg ${pageNum === '...'
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
              className={`p-2 rounded-lg ${currentPage === totalPages
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}