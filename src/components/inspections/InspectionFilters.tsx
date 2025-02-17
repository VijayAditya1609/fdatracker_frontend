// src/components/inspections/InspectionFilters.tsx
import React from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';

interface InspectionFiltersProps {
  filters: {
    Country: string[];
    PostedCitations: string[];
    ClassificationCode: string[];
    Year: string[];
    ProductType: string[];
  };
  selectedFilters: Record<string, string>;
  showFilters: boolean;
  onToggleFilters: () => void;
  onFilterChange: (key: string, value: string) => void;
  onClearFilter: (key: string) => void;
  onClearAllFilters: () => void;
}

export default function InspectionFilters({
  filters,
  selectedFilters,
  showFilters,
  onToggleFilters,
  onFilterChange,
  onClearFilter,
  onClearAllFilters
}: InspectionFiltersProps) {
  return (
    <div className="space-y-4">
      <button
        onClick={onToggleFilters}
        className={`px-4 py-2 rounded-lg border flex items-center gap-2
          ${showFilters 
            ? 'bg-gray-700 border-gray-600 text-white' 
            : 'border-gray-600 text-gray-400 hover:text-white'}`}
      >
        <Filter className="h-5 w-5" />
        Filters
      </button>

      {/* Filter Categories */}
      {showFilters && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(filters).map(([key, options]) => (
            <div key={key} className="relative">
              <select
                className="block w-full pl-4 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                         text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedFilters[key] || ''}
                onChange={(e) => onFilterChange(key, e.target.value)}
              >
                <option value="">{key.replace(/([A-Z])/g, ' $1').trim()}</option>
                {options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {/* <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" /> */}
            </div>
          ))}
        </div>
      )}

      {/* Active Filters */}
      {Object.keys(selectedFilters).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(selectedFilters).map(([key, value]) => (
            value && (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-400/10 text-blue-400 text-sm"
              >
                <span className="text-gray-400">{key}:</span>
                {value}
                <button
                  onClick={() => onClearFilter(key)}
                  className="ml-1 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            )
          ))}
          <button
            onClick={onClearAllFilters}
            className="text-sm text-gray-400 hover:text-white"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
