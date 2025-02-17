import React from 'react';

interface FilterBarProps {
  filters: {
    country: string[];
    productType: string[];
    year: string[];
    system: string[];
    subsystem: string[];
    hasForm483: string[];
  } | null;
  selectedFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
}

export default function FilterBar({ filters, selectedFilters, onFilterChange }: FilterBarProps) {
  // If filters are null, show loading or return null
  if (!filters) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      <select
        value={selectedFilters.country || 'all'}
        onChange={(e) => onFilterChange('country', e.target.value)}
        className="bg-gray-700 text-white rounded-lg border-gray-600 p-2"
      >
        <option value="all">Countries</option>
        {filters.country?.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

      <select
        value={selectedFilters.productType || 'all'}
        onChange={(e) => onFilterChange('productType', e.target.value)}
        className="bg-gray-700 text-white rounded-lg border-gray-600 p-2"
      >
        <option value="all">Product Types</option>
        {filters.productType?.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

      <select
        value={selectedFilters.year || 'all'}
        onChange={(e) => onFilterChange('year', e.target.value)}
        className="bg-gray-700 text-white rounded-lg border-gray-600 p-2"
      >
        <option value="all">Year (Since 2018)</option>
        {filters.year?.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

      <select
        value={selectedFilters.system || 'all'}
        onChange={(e) => onFilterChange('system', e.target.value)}
        className="bg-gray-700 text-white rounded-lg border-gray-600 p-2"
      >
        <option value="all">Systems</option>
        {filters.system?.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

      <select
        value={selectedFilters.subsystem || 'all'}
        onChange={(e) => onFilterChange('subsystem', e.target.value)}
        className="bg-gray-700 text-white rounded-lg border-gray-600 p-2"
      >
        <option value="all">Sub Systems</option>
        {filters.subsystem?.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>

      <select
        value={selectedFilters.hasForm483 || 'all'}
        onChange={(e) => onFilterChange('hasForm483', e.target.value)}
        className="bg-gray-700 text-white rounded-lg border-gray-600 p-2"
      >
        <option value="all">Has Form 483</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>
  );
}