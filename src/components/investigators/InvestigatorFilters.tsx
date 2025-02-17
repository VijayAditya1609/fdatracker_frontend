import React from 'react';
import { Filter, Search } from 'lucide-react';

interface InvestigatorFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  selectedFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
}

export default function InvestigatorFilters({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters,
  selectedFilters,
  onFilterChange
}: InvestigatorFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search investigators..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                     text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* <button
          onClick={onToggleFilters}
          className={`px-4 py-2 rounded-lg border flex items-center gap-2
            ${showFilters 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'border-gray-600 text-gray-400 hover:text-white'}`}
        >
          <Filter className="h-5 w-5" />
          Filters
        </button> */}
      </div>

      {/* {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="bg-gray-700 border border-gray-600 rounded-lg text-gray-300 px-3 py-2"
            value={selectedFilters.district || ''}
            onChange={(e) => onFilterChange('district', e.target.value)}
          >
            <option value="">All Districts</option>
            <option value="northeast">Northeast</option>
            <option value="southeast">Southeast</option>
            <option value="central">Central</option>
            <option value="pacific">Pacific</option>
          </select>

          <select
            className="bg-gray-700 border border-gray-600 rounded-lg text-gray-300 px-3 py-2"
            value={selectedFilters.specialization || ''}
            onChange={(e) => onFilterChange('specialization', e.target.value)}
          >
            <option value="">All Specializations</option>
            <option value="sterile">Sterile Manufacturing</option>
            <option value="api">API Manufacturing</option>
            <option value="biotech">Biotechnology</option>
            <option value="quality">Quality Systems</option>
          </select>

          <select
            className="bg-gray-700 border border-gray-600 rounded-lg text-gray-300 px-3 py-2"
            value={selectedFilters.experience || ''}
            onChange={(e) => onFilterChange('experience', e.target.value)}
          >
            <option value="">All Experience Levels</option>
            <option value="junior">0-5 years</option>
            <option value="mid">5-10 years</option>
            <option value="senior">10+ years</option>
          </select>
        </div>
      )} */}
    </div>
  );
}