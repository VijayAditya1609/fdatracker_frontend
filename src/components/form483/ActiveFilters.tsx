import React from 'react';
import { X } from 'lucide-react';

interface ActiveFiltersProps {
  selectedFilters: Record<string, string>;
  onClearFilter: (key: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilters({
  selectedFilters,
  onClearFilter,
  onClearAll
}: ActiveFiltersProps) {
  const hasFilters = Object.values(selectedFilters).some(value => value !== '');

  if (!hasFilters) return null;

  return (
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
        onClick={onClearAll}
        className="text-sm text-gray-400 hover:text-white"
      >
        Clear all
      </button>
    </div>
  );
}