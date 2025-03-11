// src/pages/SimilarObservationsPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "../services/authFetch";
import { api } from "../config/api";
import DashboardLayout from "../components/layouts/DashboardLayout";

import {
  Loader2,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

interface SimilarObservation {
  issue_date: string;
  company_affected: string;
  producttype: string;
  observation_id: string;
  id: string; // PDF ID for the observation report
}

const SimilarObservationsPage: React.FC = () => {
  // Retrieve query parameters from the URL
  const { observationId, pdfId } = useParams<{ observationId: string; pdfId: string }>();

  
  const [similarObservations, setSimilarObservations] = useState<SimilarObservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // For search, sorting, and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "company" | "producttype">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  // Fetch similar observations from the backend
  useEffect(() => {
    const fetchSimilarObservations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await authFetch(`${api.similarObservation}?id=${observationId}&pdfId=${pdfId}`);
        if (response.status === 404) {
          console.warn("No similar observations found.");
          setSimilarObservations([]);
          return;
        } else if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch similar observations");
        }
        // The backend returns a JSON array directly
        const data = await response.json();
        setSimilarObservations(data || []);
      } catch (error) {
        console.error("Error fetching similar observations:", error);
        setError("Failed to load similar observations.");
        setSimilarObservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarObservations();
  }, [observationId, pdfId]);

  // Filter observations by search query (on company name)
  const filteredObservations = similarObservations.filter((obs) =>
    obs.company_affected.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort data based on sortBy and sortOrder
  const sortData = useCallback(
    (data: SimilarObservation[]) => {
      return data.sort((a, b) => {
        const order = sortOrder === "asc" ? 1 : -1;
        if (sortBy === "date") {
          return order * (new Date(a.issue_date).getTime() - new Date(b.issue_date).getTime());
        }
        if (sortBy === "company") {
          return order * a.company_affected.localeCompare(b.company_affected);
        }
        if (sortBy === "producttype") {
          return order * a.producttype.localeCompare(b.producttype);
        }
        return 0;
      });
    },
    [sortBy, sortOrder]
  );

  const sortedObservations = sortData(filteredObservations);

  // Pagination
  const totalPages = Math.ceil(sortedObservations.length / itemsPerPage);
  const paginatedObservations = sortedObservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate pagination numbers (up to 5 visible)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/form-483s/${pdfId}/analysis/${observationId}`)}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Observation Analysis
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white">Similar Observations</h1>
            <p className="text-gray-400 mt-1">List of observations similar to the current one</p>
          </div>
          {/* "View Similar Observations" button is not needed here since this is the Similar Observations page */}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 
                       placeholder-gray-400"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">{error}</div>
        )}

        {/* Similar Observations Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => {
                      if (sortBy === "date") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("date");
                        setSortOrder("asc");
                      }
                    }}
                  >
                    Issue Date {sortBy === "date" && (sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />)}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => {
                      if (sortBy === "company") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("company");
                        setSortOrder("asc");
                      }
                    }}
                  >
                    Company {sortBy === "company" && (sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />)}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                    onClick={() => {
                      if (sortBy === "producttype") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortBy("producttype");
                        setSortOrder("asc");
                      }
                    }}
                  >
                    Product Type {sortBy === "producttype" && (sortOrder === "asc" ? <ChevronUp /> : <ChevronDown />)}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Observation Report
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {paginatedObservations.map((obs) => (
                  <tr
                    key={obs.observation_id}
                    className="hover:bg-gray-700/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {obs.issue_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {obs.company_affected}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                      {obs.producttype}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() =>
                          navigate(`/form-483s/${obs.id}/analysis/${obs.observation_id}`)
                        }
                        className="text-blue-500 hover:underline"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3 w-full overflow-hidden">
              <div className="text-sm text-gray-400">
                Showing{" "}
                <span className="font-medium text-white">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-white">
                  {Math.min(currentPage * itemsPerPage, sortedObservations.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-white">{sortedObservations.length}</span> entries
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="flex gap-1">
                  {getPageNumbers().map((pageNum, idx) => (
                    <button
                      key={idx}
                      onClick={() => typeof pageNum === "number" && setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-lg ${
                        pageNum === "..."
                          ? "text-gray-400 cursor-default"
                          : pageNum === currentPage
                          ? "bg-blue-500 text-white"
                          : "text-gray-400 hover:text-white hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${
                    currentPage === totalPages
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* No Results */}
          {sortedObservations.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No similar observations found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SimilarObservationsPage;
