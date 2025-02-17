import React from 'react';
import { Activity, Bell, Search, Settings } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 border-b border-gray-700 fixed w-full z-30 top-0">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-semibold text-gray-100">FDA Tracker</span>
          </div>
          
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search applications..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 
                         placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-700 rounded-lg relative">
              <Bell className="h-6 w-6 text-gray-300" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-lg">
              <Settings className="h-6 w-6 text-gray-300" />
            </button>
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="h-8 w-8 rounded-full border-2 border-gray-600"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}