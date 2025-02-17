import React from 'react';
import { X } from 'lucide-react';

interface FilterGroup {
  id: string;
  name: string;
  options: {
    label: string;
    value: string;
  }[];
}

interface FilterBadgesProps {
  selectedFilters: Record<string, string[]>;
  filterGroups: FilterGroup[];
  onRemoveFilter: (groupId: string, value: string) => void;
  onClearAll: () => void;
}

export default function FilterBadges({
  selectedFilters,
  filterGroups,
  onRemoveFilter,
  onClearAll,
}: FilterBadgesProps) {
  const hasFilters = Object.values(selectedFilters).some((group) => group.length > 0);

  if (!hasFilters) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {filterGroups.map((group) =>
        selectedFilters[group.id]?.map((value) => {
          const option = group.options.find((opt) => opt.value === value);
          if (!option) return null;

          return (
            <span
              key={`${group.id}-${value}`}
              className="inline-flex items-center rounded-full bg-blue-400/10 px-3 py-1 text-sm text-blue-400"
            >
              <span className="mr-1 text-gray-400">{group.name}:</span>
              {option.label}
              <button
                type="button"
                onClick={() => onRemoveFilter(group.id, value)}
                className="ml-1 rounded-full p-0.5 hover:bg-blue-500/20"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          );
        })
      )}
      {hasFilters && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-sm text-gray-400 hover:text-gray-300"
        >
          Clear all
        </button>
      )}
    </div>
  );
}