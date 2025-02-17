import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  BarChart2,
  Activity,
} from 'lucide-react';
import Logo from '../landing/Logo';

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
      // { name: 'Company Comparison', href: '/company-comparison', icon: BarChart2, comingSoon: true },
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

export default function Sidebar() {
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;
  const isChildActive = (children: any[]) => 
    children?.some(child => location.pathname === child.href);

  const ComingSoonLink = ({ item }: { item: any }) => (
    <div className="relative group">
      <div className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg
        ${isActive(item.href)
          ? 'bg-gray-700/50 text-gray-400'
          : 'text-gray-400 hover:bg-gray-700/30'
        }`}
      >
        {item.icon && <item.icon className="mr-3 h-4 w-4" />}
        {item.name}
      </div>
      <div className="absolute inset-0 bg-gray-800/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
        <span className="text-yellow-400 text-sm font-medium">Coming Soon</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 border-r border-gray-700">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
        </div>

        <div className="flex-1 px-3 mt-3 py-4 space-y-1">
          {navigation.map((item) => (
            <div key={item.name}>
              {!item.children ? (
                item.comingSoon ? (
                  <ComingSoonLink item={item} />
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg
                      ${isActive(item.href)
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              ) : (
                <div className="space-y-1">
                  <div className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg
                    ${isChildActive(item.children) ? 'bg-gray-700/50 text-white' : 'text-gray-300'}
                  `}>
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                  <div className="ml-4 space-y-1">
                    {item.children.map((child) => (
                      child.comingSoon ? (
                        <ComingSoonLink key={child.name} item={child} />
                      ) : (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg
                            ${isActive(child.href)
                              ? 'bg-gray-700 text-white'
                              : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                          {child.icon && <child.icon className="mr-3 h-4 w-4" />}
                          {child.name}
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}