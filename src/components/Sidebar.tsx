import React from 'react';
import { LayoutDashboard, FileText, BarChart, Users, Calendar, Settings, HelpCircle } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, current: true },
  { name: 'Applications', icon: FileText, current: false },
  { name: 'Analytics', icon: BarChart, current: false },
  { name: 'Team', icon: Users, current: false },
  { name: 'Calendar', icon: Calendar, current: false },
];

const secondary = [
  { name: 'Settings', icon: Settings },
  { name: 'Help', icon: HelpCircle },
];

export default function Sidebar() {
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white">
      <div className="flex flex-col h-full">
        <div className="space-y-4 py-4">
          <div className="px-4 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                className={`flex items-center space-x-3 w-full px-4 py-2.5 text-sm font-medium rounded-lg 
                          hover:bg-gray-700 transition-colors ${
                  item.current ? 'bg-gray-700 text-white' : 'text-gray-300'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto border-t border-gray-700 py-4">
          <div className="px-4 space-y-1">
            {secondary.map((item) => (
              <button
                key={item.name}
                className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm font-medium text-gray-300 
                         rounded-lg hover:bg-gray-700 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}