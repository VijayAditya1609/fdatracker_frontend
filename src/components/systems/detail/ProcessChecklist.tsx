import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import { api } from '../../../config/api';
import { auth } from '../../../services/auth';
import { authFetch } from '../../../services/authFetch';

interface ChecklistItem {
  question: string;
  acceptance_criteria: string;
}

interface ProcessChecklistProps {
  checklist: ChecklistItem[];
  processType: string;
  dateRange: string;
}

export default function ProcessChecklist({ checklist, processType, dateRange }: ProcessChecklistProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const itemsPerPage = 10;

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const encodedProcessType = encodeURIComponent(processType);
      // Update the URL to use the /api prefix
      const response = await authFetch(`${api.processChecklist}?process_type=${encodedProcessType}&date_Range=${dateRange}`);


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${processType}_Checklist.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading checklist:', error);
      // Handle specific errors
      if (error instanceof Error) {
        if (error.message.includes('Unauthorized')) {
          // Handle unauthorized access - your authFetch already handles logout
          // You might want to show a message to the user or redirect
        } else if (error.message.includes('No authentication token')) {
          // Handle missing token
        } else {
          // Handle other errors
        }
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // Filter checklist based on search
  const filteredChecklist = checklist.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.acceptance_criteria.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredChecklist.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredChecklist.slice(startIndex, endIndex);

  // Generate page numbers with ellipsis
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
      {/* Header with Search and Download Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search checklist..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                     text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg 
                   transition-colors ${isDownloading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              Download
            </>
          )}
        </button>
      </div>

      {/* Checklist Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-700">
      <thead className="bg-gray-900/50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
            #
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
            Question
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
            Acceptance Criteria
          </th>
        </tr>
      </thead>
      <tbody className="bg-gray-800 divide-y divide-gray-700">
        {currentItems.map((item, index) => (
          <tr key={index} className="hover:bg-gray-700/50">
            <td className="px-6 py-4 whitespace-nowrap text-sm">
              <span className="inline-flex items-center rounded-full bg-blue-400/10 px-2.5 py-1 text-xs font-medium text-blue-400">
                {startIndex + index + 1}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-300 break-words">
              {item.question}
            </td>
            <td className="px-6 py-4 text-sm text-gray-300 break-words">
              {item.acceptance_criteria}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3 w-full overflow-hidden">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium text-white">{startIndex + 1}</span> to{' '}
            <span className="font-medium text-white">
              {Math.min(endIndex, filteredChecklist.length)}
            </span> of{' '}
            <span className="font-medium text-white">{filteredChecklist.length}</span> entries
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