import React from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export default function SearchBar({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search warning letters..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 
                   placeholder-gray-400"
        />
      </div>
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
    </div>
  );
}