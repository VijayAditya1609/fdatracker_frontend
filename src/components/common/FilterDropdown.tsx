import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterDropdownProps {
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function FilterDropdown({
  name,
  options,
  value,
  onChange,
  icon: Icon
}: FilterDropdownProps) {
  return (
    <div className="relative">
      <select
        className="block w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{name}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option === 'all' ? 'All' : option}
          </option>
        ))}
      </select>
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      )}
      {/* <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" /> */}
    </div>
  );
}