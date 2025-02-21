import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Observation } from '../../../types/system';

interface ObservationsListProps {
  observations: Observation[];
}

const ITEMS_PER_PAGE = 10;

export default function ObservationsList({ observations }: ObservationsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'date' | 'company'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showEscalated, setShowEscalated] = useState<'all' | 'escalated' | 'normal'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
  const [filteredObservations, setFilteredObservations] = useState<Observation[]>([]);

  const navigate = useNavigate();

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, showEscalated, sortField, sortDirection]);

  // Update filtered observations whenever any filter changes
  useEffect(() => {
    // Create a new Set to track unique observation IDs
    const uniqueIds = new Set<string>();
    
    // Filter and ensure uniqueness
    const filtered = observations
      .filter((obs) => {
        // Check if we've seen this ID before
        if (uniqueIds.has(obs.id)) {
          return false;
        }
        uniqueIds.add(obs.id);

        const matchesSearch =
          obs.company_affected.toLowerCase().includes(searchQuery.toLowerCase()) ||
          obs.observation_title.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesEscalated =
          showEscalated === 'all' ||
          (showEscalated === 'escalated' && obs.is_escalated === 't') ||
          (showEscalated === 'normal' && obs.is_escalated === 'f');
        
        return matchesSearch && matchesEscalated;
      });

    // Sort the filtered array
    const sorted = [...filtered].sort((a, b) => {
      if (sortField === 'date') {
        const dateComparison =
          new Date(a.issue_date).getTime() - new Date(b.issue_date).getTime();
        return sortDirection === 'asc' ? dateComparison : -dateComparison;
      }
      const companyComparison = a.company_affected.localeCompare(b.company_affected);
      return sortDirection === 'asc' ? companyComparison : -companyComparison;
    });

    setFilteredObservations(sorted);
  }, [observations, searchQuery, showEscalated, sortField, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredObservations.length / ITEMS_PER_PAGE);
  
  // Ensure current page is valid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  // Get paginated observations
  const paginatedObservations = filteredObservations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: 'date' | 'company') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (value: 'all' | 'escalated' | 'normal') => {
    setShowEscalated(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

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
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search observations..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 
                     placeholder-gray-400"
          />
        </div>
        <select
          value={showEscalated}
          onChange={(e) => handleFilterChange(e.target.value as 'all' | 'escalated' | 'normal')}
          className="bg-gray-700 border border-gray-600 rounded-lg text-white px-4 py-2"
        >
          <option value="all">All Observations</option>
          <option value="escalated">Escalated</option>
          <option value="normal">Normal</option>
        </select>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('company')}
                >
                  Title/Company {sortField === 'company' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {paginatedObservations.map((observation) => (
                <tr key={observation.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div
                      className="text-sm font-medium text-blue-400 cursor-pointer"
                      onClick={() => navigate(`/form-483s/observations/${observation.id}`)}
                    >
                      {observation.observation_title}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{observation.company_affected}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-400">
                      {new Date(observation.issue_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {observation.is_escalated === 't' ? (
                      <span className="inline-flex items-center rounded-full bg-red-400/10 px-2.5 py-1 text-xs font-medium text-red-400">
                        Escalated
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-green-400/10 px-2.5 py-1 text-xs font-medium text-green-400">
                        Normal
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400 line-clamp-2">
                      {observation.excerpt_from_observation}
                    </div>
                    <button
                      onClick={() => setSelectedObservation(observation)}
                      className="text-blue-400 underline text-sm ml-2"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3 w-full overflow-hidden">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
            <span className="font-medium text-white">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredObservations.length)}
            </span> of{' '}
            <span className="font-medium text-white">{filteredObservations.length}</span> entries
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


      {/* Overlay */}
      {selectedObservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-gray-800 rounded-lg shadow-lg w-96 p-6 space-y-4 transform transition-transform duration-300 scale-95"
          >
            <h2 className="text-xl font-semibold text-white">
              {selectedObservation.observation_title}
            </h2>
            <ul className="text-gray-400 space-y-2">
              <li>
                <strong>Company:</strong> {selectedObservation.company_affected}
              </li>
              <li>
                <strong>Issue Date:</strong>{' '}
                {new Date(selectedObservation.issue_date).toLocaleDateString()}
              </li>
              <li>
                <strong>Escalated:</strong>{' '}
                {selectedObservation.is_escalated === 't' ? 'Yes' : 'No'}
              </li>
              {/* <li>
                <strong>PDF ID:</strong> {selectedObservation.pdf_id}
              </li> */}
              <li>
                <strong>Justification:</strong> {selectedObservation.justification}
              </li>
              <li>
                <strong>Excerpt from observation:</strong> {selectedObservation.excerpt_from_observation}
              </li>
            </ul>
            <div className="text-right">
              <button
                onClick={() => setSelectedObservation(null)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
