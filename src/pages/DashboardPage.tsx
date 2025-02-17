import React, { useState } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { KeyMetrics } from '../components/dashboard';
import ProblematicSubsystems from '../components/dashboard/SubsystemAnalytics/ProblematicSubsystems';
import SubsystemTrends from '../components/dashboard/SubsystemAnalytics/SubsystemTrends';
import SixSystemDistribution from '../components/dashboard/SubsystemAnalytics/SixSystemDistribution';
import RecentForm483s from '../components/dashboard/RecentForm483s';
import RecentWarningLetters from '../components/dashboard/RecentWarningLetters';
import TopInvestigators from '../components/dashboard/TopInvestigators';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { Calendar } from 'lucide-react';
import { auth } from '../services/auth';

const dateRangeOptions = [
  { value: '90days', label: 'Last 3 Months' },
  { value: '180days', label: 'Last 6 Months' },
  { value: '365days', label: 'Last 12 Months' },
  { value: 'all', label: 'Since 2018' },
];

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState('365days');
  useDocumentTitle('Dashboard');

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Date Range Selector */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-white">Welcome, {auth.getUser()?.firstName} {auth.getUser()?.lastName}</h1>
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 pr-10 
                           text-gray-200 focus:ring-2 focus:ring-blue-500 cursor-pointer min-w-[160px]"
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
          </div>
        </div>

        {/* Key Metrics */}
        <KeyMetrics dateRange={dateRange} />
        
        <div className="mt-8 space-y-8">
          {/* Recent FDA Actions - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentForm483s />
            <RecentWarningLetters />
          </div>

          {/* Top Cites and Investigators - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProblematicSubsystems dateRange={dateRange} />
            <TopInvestigators />
          </div>

          {/* Subsystem Analytics - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SubsystemTrends dateRange={dateRange} />
            <SixSystemDistribution dateRange={dateRange} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}