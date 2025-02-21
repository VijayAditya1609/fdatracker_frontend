import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, Tag, Building2, FileText, AlertTriangle, Package, Factory, X,LucideIcon, ChevronDown, Clock, AlertCircle, TrendingUp, Calendar, MapPin, Users, FileWarning, Activity, Loader2, ChevronLeft, ChevronRight, FilterIcon, XCircle } from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { useAdvancedFilters } from '../hooks/useAdvancedFilters';
import { Link } from 'react-router-dom';
import { searchData } from '../services/search';
import type { SearchResponse } from '../services/search';
import { useNavigate } from 'react-router-dom';
import { api } from '../config/api';
import { auth } from '../services/auth';
import { authFetch } from '../services/authFetch';

interface SearchResult {
  id: string;
  type: 'form483' | 'warning-letter' | 'company' | 'facility' | 'product';
  title: string;
  description: string;
  date?: string;
  status?: string;
  relevanceScore: number;
  semanticTags: {
    category: string;
    value: string;
    confidence: number;
  }[];
  metadata: {
    [key: string]: any;
  };
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    documentType: ['all'],
    year: ['all'],
    qualitySystem: ['all'],
    region: ['all'],
    subSystem: ['all'],
    productType: ['all']
  });
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const { filterOptions, isLoading, error } = useAdvancedFilters();
  const navigate = useNavigate();
  const [topForm483s, setTopForm483s] = useState<any[]>([]);
  const [topWarningLetters, setTopWarningLetters] = useState<any[]>([]);
  const [isLoadingTop, setIsLoadingTop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState({ form483: 0, warningLetters: 0 });
  const ITEMS_PER_PAGE = 20;

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => {
      const currentFilters = prev[filterType as keyof typeof prev];

      let updatedFilters;
      if (value === 'all') {
        updatedFilters = {
          ...prev,
          [filterType]: ['all'],
        };
      } else {
        const newTypeFilters = currentFilters.includes(value)
          ? currentFilters.filter(item => item !== value)
          : [...currentFilters.filter(item => item !== 'all'), value];

        updatedFilters = {
          ...prev,
          [filterType]: newTypeFilters.length === 0 ? ['all'] : newTypeFilters,
        };
      }

      // Store updated filters in session storage
      storeFiltersInSession(updatedFilters);
      return updatedFilters;
    });
  };

  // Function to reset to default view
  const resetToDefaultView = async () => {
    setSearchResults(null);
    setIsLoadingTop(true);
  
    try {
      const [form483Data, wlData] = await Promise.all([
        authFetch(`${api.form483List}?start=0&length=5`).then(res => res.json()),
        authFetch(`${api.warningLettersList}?start=0&length=5`).then(res => res.json())
      ]);
  
      setTopForm483s(form483Data);
      setTopWarningLetters(wlData);
    } catch (error) {
      console.error('Error fetching top documents:', error);
    } finally {
      setIsLoadingTop(false);
    }
  };
  

  // Modified clear filters handler
  const handleClearFilters = () => {
    const defaultFilters = {
      documentType: ['all'],
      year: ['all'],
      qualitySystem: ['all'],
      region: ['all'],
      subSystem: ['all'],
      productType: ['all']
    };
    
    setSelectedFilters(defaultFilters);
    sessionStorage.removeItem('lastAppliedFilters');

    // If there's no search query, reset to default view
    if (!searchQuery.trim()) {
      resetToDefaultView();
    } else {
      // If there's a search query, perform search with cleared filters
      handleSearch();
    }
  };

  // Add this function to handle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Modified search query handler
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    setCurrentPage(1); // Reset to first page when search query changes
    
    // Only store non-empty queries in session storage
    if (newQuery.trim()) {
      sessionStorage.setItem('lastSearchQuery', newQuery);
    } else {
      sessionStorage.removeItem('lastSearchQuery');
    }
  };

  // Add this function to store filters in session storage
  const storeFiltersInSession = (filters: typeof selectedFilters) => {
    sessionStorage.setItem('lastAppliedFilters', JSON.stringify(filters));
  };

  // Modified search handler to handle empty results better
  const handleSearch = async (page: number = currentPage) => {
    setIsSearching(true);
    setSearchError(null);

    try {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const results = await searchData(
        searchQuery.trim(),
        selectedFilters,
        start,
        ITEMS_PER_PAGE
      );
      setSearchResults(results);
      setTotalResults({
        form483: results.totalForm483,
        warningLetters: results.totalWarningLetters
      });

      // If no results on current page, find the last page with results
      if (results.form483.length === 0 && results.warningLetters.length === 0 && page > 1) {
        const totalItems = Math.max(results.totalForm483, results.totalWarningLetters);
        const lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE);
        if (lastPage < page) {
          handlePageChange(lastPage);
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(error instanceof Error ? error.message : 'Failed to perform search');
    } finally {
      setIsSearching(false);
    }
  };

  // Handle page change with smooth scroll
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    handleSearch(newPage);
    // Smooth scroll to top of results
    document.querySelector('.scrollable-results')?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Modified useEffect to handle search and filter changes
  useEffect(() => {
    // Only trigger search if we have filters selected other than 'all'
    const hasActiveFilters = Object.entries(selectedFilters).some(([_, values]) => {
      return !values.includes('all') || values.length > 1;
    });

    if (searchQuery.trim() || hasActiveFilters) {
      handleSearch();
    } else {
      // If no search query and no active filters, show default view
      resetToDefaultView();
    }
  }, [
    searchQuery,
    selectedFilters.documentType,
    selectedFilters.year,
    selectedFilters.qualitySystem,
    selectedFilters.region,
    selectedFilters.subSystem,
    selectedFilters.productType
  ]);

  // Fetch top documents when component mounts
  useEffect(() => {
    const fetchTopDocuments = async () => {
      setIsLoadingTop(true);
      try {
        const [form483Data, wlData] = await Promise.all([
          authFetch(`${api.form483List}?start=0&length=5`).then(res => res.json()),
          authFetch(`${api.warningLettersList}?start=0&length=5`).then(res => res.json())
        ]);
  
        setTopForm483s(form483Data);
        setTopWarningLetters(wlData);
      } catch (error) {
        console.error('Error fetching top documents:', error);
      } finally {
        setIsLoadingTop(false);
      }
    };
  
    fetchTopDocuments();
  }, []);
  

  // Add useEffect to restore search state from session storage
  useEffect(() => {
    const lastQuery = sessionStorage.getItem('lastSearchQuery');
    const lastFilters = sessionStorage.getItem('lastAppliedFilters');

    if (lastQuery && lastQuery.trim()) {
      setSearchQuery(lastQuery);
    }

    if (lastFilters) {
      try {
        const parsedFilters = JSON.parse(lastFilters);
        setSelectedFilters(parsedFilters);
      } catch (error) {
        console.error('Error parsing stored filters:', error);
      }
    }

    // Only trigger search if we have a query or active filters
    if (lastQuery?.trim() || lastFilters) {
      handleSearch();
    }
  }, []);

  const renderForm483Card = (item: any) => (
    <div
      key={item.id}
      className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-colors cursor-pointer"
      onClick={() => handleForm483Click(item.id)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium truncate">{item.facilityName}</h4>
          <p className="text-gray-400 mt-1 text-sm truncate">{item.companyName}</p>
        </div>
        <span className="ml-2 inline-flex items-center rounded-full bg-blue-400/10 px-2.5 py-1 text-xs font-medium text-blue-400 whitespace-nowrap">
          {item.numOfObservations} Observations
        </span>
      </div>

      {/* Only show systems if they exist and are not NULL */}
      {item.systems && item.systems.length > 0 && !item.systems.includes("NULL") && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.systems.slice(0, 3).map((system: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-300"
            >
              {system.replace(/"/g, '')}
            </span>
          ))}
          {item.systems.length > 3 && (
            <span className="inline-flex items-center rounded-full bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-300">
              +{item.systems.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{item.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>{new Date(item.issueDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );

  const renderWarningLetterCard = (item: any) => (
    <div
      key={item.id}
      className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-colors cursor-pointer"
      onClick={() => handleWarningLetterClick(item.id)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium truncate">{item.facilityName}</h4>
          {item.companyName && (
            <p className="text-gray-400 mt-1 text-sm truncate">{item.companyName}</p>
          )}
        </div>
        <span className="ml-2 inline-flex items-center rounded-full bg-red-400/10 px-2.5 py-1 text-xs font-medium text-red-400 whitespace-nowrap">
          {item.numOfViolations} Violations
        </span>
      </div>

      {/* Only show systems if they exist and are not NULL */}
      {item.systems && item.systems.length > 0 && !item.systems.includes("NULL") && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.systems.slice(0, 3).map((system: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-300"
            >
              {system.replace(/"/g, '')}
            </span>
          ))}
          {item.systems.length > 3 && (
            <span className="inline-flex items-center rounded-full bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-300">
              +{item.systems.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Only show product types if they exist and are valid */}
      {item.productTypes && item.productTypes.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.productTypes.map((type: string, index: number) => {
            try {
              const parsedType = type.replace(/\\/g, '').replace(/"\[|\]"/g, '');
              return (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-yellow-400/10 px-2 py-0.5 text-xs font-medium text-yellow-400"
                >
                  {parsedType}
                </span>
              );
            } catch (error) {
              return null;
            }
          })}
        </div>
      )}

      <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{item.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span>{new Date(item.issueDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );

  const handleForm483Click = (id: string) => {
    navigate(`/form-483s/${id}`);
  };

  const handleWarningLetterClick = (id: string) => {
    navigate(`/warning-letters/${id}`);
  };

  // Improved pagination component with floating design
  const PaginationControls = () => {
    // Calculate total pages based on the maximum number of results
    const totalPages = Math.ceil(
      Math.max(totalResults.form483, totalResults.warningLetters) / ITEMS_PER_PAGE
    );
    
    const hasMoreResults = searchResults && 
      (searchResults.form483.length > 0 || searchResults.warningLetters.length > 0);

    // Don't show pagination if no results or only one page
    if (!hasMoreResults && currentPage === 1) return null;

    return (
      <div className="sticky bottom-8 w-full max-w-[1200px] mx-auto z-30">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/95 backdrop-blur-sm rounded-full border border-gray-700 shadow-lg">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-full bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <span className="text-gray-300 text-sm px-2">
              <span className="font-medium">Page {currentPage}</span>
              {totalPages > 0 && <span className="text-gray-500"> of {totalPages}</span>}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || !hasMoreResults}
              className="px-3 py-1.5 rounded-full bg-gray-700 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add this function to check if a filter category has active filters
  const hasActiveFilters = (filterType: string) => {
    const filters = selectedFilters[filterType as keyof typeof selectedFilters];
    return !filters.includes('all') || filters.length > 1;
  };

  // Modified filter button component
  const FilterButton = ({ categoryId, icon: Icon, label }: { categoryId: string; icon: LucideIcon; label: string }) => {
    const isExpanded = expandedCategories.includes(categoryId);
    const hasFilters = hasActiveFilters(categoryId);
    
    return (
      <button
        onClick={() => toggleCategory(categoryId)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-300 transition-colors
          ${hasFilters 
            ? 'bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30' 
            : 'bg-gray-700 hover:bg-gray-600'}`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`h-5 w-5 ${hasFilters ? 'text-blue-400' : ''}`} />
          <span className={`${hasFilters ? 'text-blue-400 font-medium' : ''} whitespace-nowrap`}>
            {label}
          </span>
        </div>
        
        <div className="flex items-center gap-3 ml-2">
          {hasFilters && (
            <span className="text-xs bg-blue-500/30 text-blue-300 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span>{selectedFilters[categoryId as keyof typeof selectedFilters].length}</span>
              <FilterIcon className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown 
            className={`h-4 w-4 transform transition-transform duration-200 
              ${isExpanded ? 'rotate-180' : ''} 
              ${hasFilters ? 'text-blue-400' : ''}`}
          />
        </div>
      </button>
    );
  };

  // No Results Component
  const NoResultsMessage = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-gray-800/50 rounded-full p-4 mb-4">
        <XCircle className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
      <p className="text-gray-400 text-center max-w-md mb-4">
        We couldn't find any matches for "{searchQuery}". Try adjusting your search or filters.
      </p>
      {Object.values(selectedFilters).some(filters => filters.length > 0) && (
        <button
          onClick={handleClearFilters}
          className="text-blue-400 hover:text-blue-300 flex items-center gap-2 text-sm"
        >
          <SearchIcon className="h-4 w-4" />
          Clear all filters and try again
        </button>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        {/* Sticky Header Section */}
        <div className="sticky top-0 z-20 bg-gray-900 px-8 py-4 border-b border-gray-800 mt-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gradient bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Search across FDA Form 483s and Warning Letters
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative mb-0">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by keyword FDA Form 483s and Warning Letters"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="w-full pl-12 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
            {searchQuery && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => {
                  setSearchQuery('');
                  sessionStorage.removeItem('lastSearchQuery');
                  // The useEffect will handle resetting to default view
                }}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 relative mt-4 mb-4">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-8">
            {/* Sticky Filters Section */}
            <div className="lg:col-span-1">
              <div className="top-[172px] max-h-[calc(100vh-172px)] overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
                  <h2 className="text-lg font-medium text-white mb-4">Filters</h2>

                  {/* Document Type Filter */}
                  <div className="mb-4">
                    <FilterButton
                      categoryId="documentType"
                      icon={FileText}
                      label="Document Type"
                    />
                    {expandedCategories.includes('documentType') && filterOptions.documentType && (
                      <div className="mt-2 pl-2 max-h-48 overflow-y-auto 
                        scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/40 
                        hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full">
                        {filterOptions.documentType.map((option) => (
                          <label
                            key={option}
                            className="flex items-center w-full px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFilters.documentType.includes(option)}
                              onChange={() => handleFilterChange('documentType', option)}
                              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 
                                       focus:ring-blue-500 focus:ring-offset-gray-800"
                            />
                            <span className={`ml-3 ${selectedFilters.documentType.includes(option)
                                ? 'text-blue-400'
                                : 'text-gray-300'
                              }`}>
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Year Filter */}
                  <div className="mb-4">
                    <FilterButton
                      categoryId="year"
                      icon={Calendar}
                      label="Issue Year"
                    />
                    {expandedCategories.includes('year') && filterOptions.year && (
                      <div className="mt-2 pl-2 max-h-48 overflow-y-auto 
                        scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/40 
                        hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full">
                        {filterOptions.year.map((option) => (
                          <label
                            key={option}
                            className="flex items-center w-full px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFilters.year.includes(option)}
                              onChange={() => handleFilterChange('year', option)}
                              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 
                                       focus:ring-blue-500 focus:ring-offset-gray-800"
                            />
                            <span className={`ml-3 ${selectedFilters.year.includes(option)
                                ? 'text-blue-400'
                                : 'text-gray-300'
                              }`}>
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quality Systems Filter */}
                  <div className="mb-4">
                    <FilterButton
                      categoryId="qualitySystem"
                      icon={Activity}
                      label="Quality Systems"
                    />
                    {expandedCategories.includes('qualitySystem') && filterOptions.qualitySystem && (
                      <div className="mt-2 pl-2 max-h-48 overflow-y-auto 
                        scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/40 
                        hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full">
                        {filterOptions.qualitySystem.map((option) => (
                          <label
                            key={option}
                            className="flex items-center w-full px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFilters.qualitySystem.includes(option)}
                              onChange={() => handleFilterChange('qualitySystem', option)}
                              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 
                                       focus:ring-blue-500 focus:ring-offset-gray-800"
                            />
                            <span className={`ml-3 ${selectedFilters.qualitySystem.includes(option)
                                ? 'text-blue-400'
                                : 'text-gray-300'
                              }`}>
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Region Filter */}
                  <div className="mb-4">
                    <FilterButton
                      categoryId="region"
                      icon={MapPin}
                      label="Region"
                    />
                    {expandedCategories.includes('region') && filterOptions.region && (
                      <div className="mt-2 pl-2 max-h-48 overflow-y-auto 
                        scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/40 
                        hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full">
                        {filterOptions.region.map((option) => (
                          <label
                            key={option}
                            className="flex items-center w-full px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFilters.region.includes(option)}
                              onChange={() => handleFilterChange('region', option)}
                              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 
                                       focus:ring-blue-500 focus:ring-offset-gray-800"
                            />
                            <span className={`ml-3 ${selectedFilters.region.includes(option)
                                ? 'text-blue-400'
                                : 'text-gray-300'
                              }`}>
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Subsystem Filter */}
                  <div className="mb-4">
                    <FilterButton
                      categoryId="subSystem"
                      icon={Activity}
                      label="Subsystem"
                    />
                    {expandedCategories.includes('subSystem') && filterOptions.subSystem && (
                      <div className="mt-2 pl-2 max-h-48 overflow-y-auto 
                        scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/40 
                        hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full">
                        {[
                          'all', // Ensure "all" is at the top
                          ...filterOptions.subSystem
                            .filter(option => option.toLowerCase() !== 'all') // Exclude "all" from sorting
                            .sort((a, b) => a.localeCompare(b)) // Sort remaining options alphabetically
                        ].map((option) => (
                          <label
                            key={option}
                            className="flex items-center w-full px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFilters.subSystem.includes(option)}
                              onChange={() => handleFilterChange('subSystem', option)}
                              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 
                                      focus:ring-blue-500 focus:ring-offset-gray-800"
                            />
                            <span
                              className={`ml-3 ${
                                selectedFilters.subSystem.includes(option)
                                  ? 'text-blue-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Type Filter */}
                  <div className="mb-4">
                    <FilterButton
                      categoryId="productType"
                      icon={Package}
                      label="Product Type"
                    />
                    {expandedCategories.includes('productType') && filterOptions.productType && (
                      <div className="mt-2 pl-2 max-h-48 overflow-y-auto 
                        scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800/40 
                        hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full">
                        {filterOptions.productType.map((option) => (
                          <label
                            key={option}
                            className="flex items-center w-full px-3 py-2 rounded-lg text-sm hover:bg-gray-700/50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFilters.productType.includes(option)}
                              onChange={() => handleFilterChange('productType', option)}
                              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 
                                       focus:ring-blue-500 focus:ring-offset-gray-800"
                            />
                            <span
                              className={`ml-3 ${
                                selectedFilters.productType.includes(option)
                                  ? 'text-blue-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Clear Filters Button */}
                  {Object.values(selectedFilters).some(filters => filters.length > 0) && (
                    <button
                      onClick={handleClearFilters}
                      className="w-full mt-4 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 
                               hover:bg-gray-600 flex items-center justify-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Scrollable Results Section */}
            <div className="lg:col-span-3 scrollable-results">
              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : searchError ? (
                <div className="bg-red-400/10 text-red-400 p-4 rounded-lg">
                  {searchError}
                </div>
              ) : searchResults ? (
                searchResults.form483.length === 0 && 
                searchResults.warningLetters.length === 0 ? (
                  <NoResultsMessage />
                ) : (
                  <div className="space-y-6">
                    {/* Form 483s - Only show if "all" or "Form 483s" is selected */}
                    {(selectedFilters.documentType.includes('all') ||
                      selectedFilters.documentType.includes('Form 483s')) && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-white">Form 483s</h3>
                            <div className="text-sm text-gray-400">
                              Showing {searchResults.form483.length} of {totalResults.form483} results
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 cursor-pointer">
                            {searchResults.form483.map((item) => (
                              <div
                                key={item.id}
                                className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-colors"
                                onClick={() => handleForm483Click(item.id)}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-medium truncate">{item.facilityName}</h4>
                                    <p className="text-gray-400 mt-1 text-sm truncate">{item.companyName}</p>
                                  </div>
                                  <span className="ml-2 inline-flex items-center rounded-full bg-blue-400/10 px-2.5 py-1 text-xs font-medium text-blue-400 whitespace-nowrap">
                                    {item.numOfObservations} Observations
                                  </span>
                                </div>

                                {/* Only show systems if they exist and are not NULL */}
                                {item.systems && item.systems.length > 0 && !item.systems.includes("NULL") && (
                                  <div className="mt-3 flex flex-wrap gap-1.5">
                                    {item.systems.slice(0, 3).map((system, index) => (
                                      <span
                                        key={index}
                                        className="inline-flex items-center rounded-full bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-300"
                                      >
                                        {system.replace(/"/g, '')}
                                      </span>
                                    ))}
                                    {item.systems.length > 3 && (
                                      <span className="inline-flex items-center rounded-full bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-300">
                                        +{item.systems.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                )}

                                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span className="truncate">{item.location}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{new Date(item.issueDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Warning Letters - Only show if "all" or "Warning Letters" is selected */}
                    {(selectedFilters.documentType.includes('all') ||
                      selectedFilters.documentType.includes('Warning Letters')) && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-white">Warning Letters</h3>
                            <div className="text-sm text-gray-400">
                              Showing {searchResults.warningLetters.length} of {totalResults.warningLetters} results
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4  cursor-pointer">

                            {searchResults.warningLetters.map((item) => (
                              <div
                                key={item.id}
                                className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-colors"
                                onClick={() => handleWarningLetterClick(item.id)}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-medium truncate">{item.facilityName}</h4>
                                    {item.companyName && (
                                      <p className="text-gray-400 mt-1 text-sm truncate">{item.companyName}</p>
                                    )}
                                  </div>
                                  <span className="ml-2 inline-flex items-center rounded-full bg-red-400/10 px-2.5 py-1 text-xs font-medium text-red-400 whitespace-nowrap">
                                    {item.numOfViolations} Violations
                                  </span>
                                </div>

                                {/* Only show systems if they exist and are not NULL */}
                                {item.systems && item.systems.length > 0 && !item.systems.includes("NULL") && (
                                  <div className="mt-3 flex flex-wrap gap-1.5">
                                    {item.systems.slice(0, 3).map((system, index) => (
                                      <span
                                        key={index}
                                        className="inline-flex items-center rounded-full bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-300"
                                      >
                                        {system.replace(/"/g, '')}
                                      </span>
                                    ))}
                                    {item.systems.length > 3 && (
                                      <span className="inline-flex items-center rounded-full bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-300">
                                        +{item.systems.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* Only show product types if they exist and are valid */}
                                {item.productTypes && item.productTypes.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1.5">
                                    {item.productTypes.map((type: string, index) => {
                                      try {
                                        const parsedType = type.replace(/\\/g, '').replace(/"\[|\]"/g, '');
                                        return (
                                          <span
                                            key={index}
                                            className="inline-flex items-center rounded-full bg-yellow-400/10 px-2 py-0.5 text-xs font-medium text-yellow-400"
                                          >
                                            {parsedType}
                                          </span>
                                        );
                                      } catch (error) {
                                        return null;
                                      }
                                    })}
                                  </div>
                                )}

                                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span className="truncate">{item.location}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{new Date(item.issueDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Show message if no document types are selected */}
                    {!selectedFilters.documentType.includes('all') &&
                      !selectedFilters.documentType.includes('Form 483s') &&
                      !selectedFilters.documentType.includes('Warning Letters') && (
                        <div className="text-center text-gray-400 py-12">
                          Please select a document type to see results
                        </div>
                      )}
                  </div>
                )
              ) : (
                <div className="space-y-8">
                {/* Top Form 483s */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Recent Form 483s</h3>
                    <Link to="/form-483s" className="text-sm text-blue-400 hover:text-blue-300">
                      View all
                    </Link>
                  </div>
                  {isLoadingTop ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                      {topForm483s.map(renderForm483Card)}
                    </div>
                  )}
                </div>
    
                {/* Top Warning Letters */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-white">Recent Warning Letters</h3>
                    <Link to="/warning-letters" className="text-sm text-blue-400 hover:text-blue-300">
                      View all
                    </Link>
                  </div>
                  {isLoadingTop ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                      {topWarningLetters.map(renderWarningLetterCard)}
                    </div>
                  )}
                </div>
              </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating pagination controls */}
        {searchResults && <PaginationControls />}
      </div>
    </DashboardLayout>
  );
}