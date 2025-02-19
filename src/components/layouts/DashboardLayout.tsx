import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../dashboard/Navbar';
import Sidebar from '../dashboard/Sidebar';
import Logo from '../landing/Logo';
import {
  LayoutDashboard,
  ClipboardCheck,
  FileWarning,
  AlertTriangle,
  Building2,
  Factory,
  Search,
  Activity as SystemsIcon,
  Users,
  Activity,
  ChevronRight
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Advanced Search', href: '/search', icon: Search, comingSoon: false },
  { 
    name: 'FDA Actions',
    icon: ClipboardCheck,
    children: [
      { name: 'Inspections', href: '/inspections', icon: Activity },
      { name: 'Form 483s', href: '/form-483s', icon: FileWarning },
      { name: 'Warning Letters', href: '/warning-letters', icon: AlertTriangle },
    ],
  },
  {
    name: 'Companies',
    icon: Building2,
    children: [
      { name: 'Companies', href: '/companies', icon: Building2, comingSoon: false },
      { name: 'Facilities', href: '/facilities', icon: Factory, comingSoon: false },
    ],
  },
  {
    name: 'Systems',
    icon: SystemsIcon,
    children: [
      { name: 'Six Systems', href: '/sixSystems', icon: SystemsIcon },
    ],
  },
  { name: 'Investigators', href: '/investigators', icon: Users }
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const isActive = (item: any) => {
    if (item.href) {
      return location.pathname === item.href;
    }
    if (item.children) {
      return item.children.some((child: any) => location.pathname === child.href);
    }
    return false;
  };

  // Handler for clicking on parent items with children
  const handleParentClick = () => {
    if (!sidebarOpen) {
      setSidebarOpen(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-40 h-full transition-all duration-300 transform 
          ${sidebarOpen ? 'translate-x-0 w-64' : 'lg:w-16 -translate-x-full lg:translate-x-0'} 
          flex flex-col bg-gray-800 border-r border-gray-700`}
      >
        <div className={`p-4 flex ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          <Link to="/" className="flex items-center">
            <Logo className={sidebarOpen ? 'w-auto h-8' : 'w-8 h-8'} />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {!item.children ? (
                  <Link
                    to={item.href}
                    className={`flex items-center ${sidebarOpen ? 'px-4' : 'justify-center'} py-2 text-sm font-medium rounded-lg ${
                      isActive(item)
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className={`${sidebarOpen ? 'mr-3' : ''} h-5 w-5`} />
                    {sidebarOpen && <span>{item.name}</span>}
                    {!sidebarOpen && (
                      <span className="sr-only">{item.name}</span>
                    )}
                    {item.comingSoon && sidebarOpen && (
                      <span className="ml-auto text-xs text-yellow-400">Soon</span>
                    )}
                  </Link>
                ) : (
                  <div className="space-y-1">
                    <div
                      onClick={handleParentClick}
                      className={`flex items-center cursor-pointer ${sidebarOpen ? 'px-4' : 'justify-center'} py-2 text-sm font-medium rounded-lg ${
                        isActive(item)
                          ? 'bg-gray-700/50 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <item.icon className={`${sidebarOpen ? 'mr-3' : ''} h-5 w-5`} />
                      {sidebarOpen && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                      {!sidebarOpen && (
                        <span className="sr-only">{item.name}</span>
                      )}
                    </div>
                    
                    {sidebarOpen && (
                      <div className="ml-4 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                              location.pathname === child.href
                                ? 'bg-gray-700 text-white'
                                : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                          >
                            {child.icon && <child.icon className="mr-3 h-4 w-4" />}
                            {child.name}
                            {child.comingSoon && (
                              <span className="ml-auto text-xs text-yellow-400">Soon</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                    
                    {!sidebarOpen && (
                      <div className="relative group">
                        <div className="hidden group-hover:block absolute left-full ml-2 top-0 z-10 origin-left transform rounded-md bg-gray-800 p-2 text-sm shadow-lg min-w-[180px]">
                          <div className="font-medium text-white mb-2 px-2">{item.name}</div>
                          <div className="space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.href}
                                className={`block px-3 py-2 rounded-md ${
                                  location.pathname === child.href
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                }`}
                              >
                                <div className="flex items-center">
                                  {child.icon && <child.icon className="mr-2 h-4 w-4" />}
                                  {child.name}
                                  {child.comingSoon && (
                                    <span className="ml-2 text-xs text-yellow-400">Soon</span>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col w-full">
        <Navbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-auto p-6 pt-20">
          {children}
        </main>
      </div>
      
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}