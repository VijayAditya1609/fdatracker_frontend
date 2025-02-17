import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterBarProps {
  filters: {
    [key: string]: string[];
  };
  selectedFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearAll: () => void;
}

export default function FilterBar({ filters, selectedFilters, onFilterChange, onClearAll }: FilterBarProps) {
  const filterLabels: Record<string, string> = {
    country: "Country",
    postedCitations: "Poster Citation",
    classificationCode: "Classification Code",
    year: "Year",
    productType: "Product Type",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {Object.entries(filters).map(([key, values]) => (
        <div key={key} className="relative">
          <select
            value={selectedFilters[key] || ''}
            onChange={(e) => onFilterChange(key, e.target.value)}
            className="w-full pl-4 pr-10 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                     text-gray-100 appearance-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent hover:border-gray-500 transition-colors"
          >
            <option value="">{filterLabels[key] || key}</option> {/* Use mapped label */}
            {values.map(value => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
          </select>
          <ChevronDown 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 
                     text-gray-400 h-5 w-5 pointer-events-none" 
          />
        </div>
      ))}
    </div>
  );
}
