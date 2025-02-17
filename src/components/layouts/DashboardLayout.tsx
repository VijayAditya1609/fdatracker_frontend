import React from 'react';
import Navbar from '../dashboard/Navbar';
import Sidebar from '../dashboard/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <Sidebar />
      <div className="pt-16 pl-64">
        <main className="min-h-screen bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}