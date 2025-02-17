import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import SystemsHeader from '../components/systems/SystemsHeader';
import SystemsGrid from '../components/systems/SystemsGrid';
import useDebounce from '../hooks/useDebounce';
import useSixSystems from '../hooks/useSixSystems';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function SubsystemsPage() {
  useDocumentTitle('Six Systems');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const debouncedSearch = useDebounce(searchQuery, 500);
  
  const { systems, isLoading, error } = useSixSystems(debouncedSearch);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-400">Loading systems data...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-400">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <SystemsHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />
        
        <SystemsGrid
          systems={systems}
          // onSystemClick={(id) => navigate(`/systems/${id}`)}
        />
      </div>
    </DashboardLayout>
  );
}