import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="mt-8 border-b border-gray-700">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                }
              `}
            >
              <Icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}