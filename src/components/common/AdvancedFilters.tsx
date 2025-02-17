import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  id: string;
  name: string;
  options: FilterOption[];
}

interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filterGroups: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, value: string) => void;
  onClearFilters: () => void;
}

export default function AdvancedFilters({
  isOpen,
  onClose,
  filterGroups,
  selectedFilters,
  onFilterChange,
  onClearFilters,
}: AdvancedFiltersProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-gray-800 shadow-xl">
                    <div className="flex items-center justify-between px-4 py-6 sm:px-6">
                      <Dialog.Title className="text-lg font-semibold text-white">
                        Advanced Filters
                      </Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="rounded-md text-gray-400 hover:text-gray-300"
                          onClick={onClose}
                        >
                          <span className="sr-only">Close panel</span>
                          <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="relative flex-1 px-4 sm:px-6">
                      <div className="space-y-6">
                        {filterGroups.map((group) => (
                          <div key={group.id} className="border-b border-gray-700 pb-6">
                            <h3 className="text-sm font-medium text-gray-300 mb-4">{group.name}</h3>
                            <div className="space-y-3">
                              {group.options.map((option) => (
                                <div key={option.value} className="flex items-center">
                                  <input
                                    id={`${group.id}-${option.value}`}
                                    name={`${group.id}[]`}
                                    type="checkbox"
                                    checked={selectedFilters[group.id]?.includes(option.value)}
                                    onChange={() => onFilterChange(group.id, option.value)}
                                    className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                  />
                                  <label
                                    htmlFor={`${group.id}-${option.value}`}
                                    className="ml-3 text-sm text-gray-300"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-gray-700 px-4 py-6 sm:px-6">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          className="text-sm font-medium text-gray-400 hover:text-gray-300"
                          onClick={onClearFilters}
                        >
                          Clear all filters
                        </button>
                        <button
                          type="button"
                          className="ml-3 inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          onClick={onClose}
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}