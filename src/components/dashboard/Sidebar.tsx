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
  X,
} from 'lucide-react';
import Logo from '../landing/Logo';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Advanced Search', href: '/search', icon: Search },  
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
      { name: 'Companies', href: '/companies', icon: Building2 },
      { name: 'Facilities', href: '/facilities', icon: Factory },
    ],
  },
  {
    name: 'Systems',
    icon: SystemsIcon,
    children: [
      { name: 'Six Systems', href: '/sixSystems', icon: SystemsIcon },
    ],
  },
  { name: 'Investigators', href: '/investigators', icon: Users },
  { name: 'My Form 483s', href: '/my-form-483s', icon: ClipboardCheck },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;
  const isChildActive = (children: any[]) =>
    children?.some(child => location.pathname === child.href);

  // const ComingSoonLink = ({ item }: { item: any }) => (
  //   <div className="relative group">
  //     <div
  //       className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
  //         isActive(item.href)
  //           ? 'bg-gray-700/50 text-gray-400'
  //           : 'text-gray-400 hover:bg-gray-700/30'
  //       }`}
  //     >
  //       {item.icon && <item.icon className="mr-3 h-4 w-4" />}
  //       {item.name}
  //     </div>
  //     <div className="absolute inset-0 bg-gray-800/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
  //       <span className="text-yellow-400 text-sm font-medium">Coming Soon</span>
  //     </div>
  //   </div>
  // );

  // Sidebar content common for mobile and desktop
  const sidebarContent = (
    <>
      <div className="p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        {/* Close button visible when sidebar is open */}
        {onClose && (
          <button onClick={onClose} className="text-gray-300">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      <div className="w-64 px-3 mt-3 py-4 space-y-1">
        {navigation.map((item) => (
          <div key={item.name}>
            {!item.children ? (
              <Link
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                  isActive(item.href)
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ) : (
              <div className="space-y-1">
                <div
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                    isChildActive(item.children)
                      ? 'bg-gray-700/50 text-white'
                      : 'text-gray-300'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </div>
                <div className="ml-4 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      to={child.href}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                        isActive(child.href)
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {child.icon && <child.icon className="mr-3 h-4 w-4" />}
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Overlay for mobile and when sidebar is toggled on larger screens */}
      <div
        className={`fixed inset-0 flex z-40 ${open ? '' : 'hidden'}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop to close sidebar when clicked */}
        <div className="fixed inset-0 bg-opacity-75" onClick={onClose}></div>
        
        {/* Sidebar panel */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-800 border-r border-gray-700">
          {sidebarContent}
        </div>
        
        {/* Dummy element to force sidebar to shrink to fit */}
        <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
      </div>

      {/* Always visible sidebar for large screens - we keep this hidden since we want toggle functionality */}
      <div className="hidden">
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;