import React from 'react';
import { X } from 'lucide-react';

interface ActiveFiltersProps {
  selectedFilters: Record<string, string>;
  onClearFilter: (key: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilters({ selectedFilters, onClearFilter, onClearAll }: ActiveFiltersProps) {
  const activeFilters = Object.entries(selectedFilters).filter(([_, value]) => value && value !== 'all');

  if (activeFilters.length === 0) return null;

  const formatFilterLabel = (key: string, value: string) => {
    // Format the filter key to be more readable
    const formattedKey = key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return `${formattedKey}: ${value}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {activeFilters.map(([key, value]) => (
        <span
          key={key}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm 
                   bg-blue-400/10 text-blue-400 hover:bg-blue-400/20 transition-colors"
        >
          {formatFilterLabel(key, value)}
          <button
            onClick={() => onClearFilter(key)}
            className="hover:bg-blue-400/20 rounded-full p-0.5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </span>
      ))}
      {activeFilters.length > 0 && (
        <button
          onClick={onClearAll}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
