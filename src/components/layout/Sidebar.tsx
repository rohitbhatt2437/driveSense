// Sidebar.tsx
import React, { useState } from 'react';
import {
  ArrowLeft,
  LayoutDashboard,
  Users,
  Truck,
  User,
  FileText,
  MapPin,
  Star,
  Settings
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/home', icon: <LayoutDashboard size={20} /> },
  { label: 'Users', href: '/dashboard/users', icon: <Users size={20} /> },
  { label: 'Register New Vehicle', href: '/dashboard/register-new-vehicle', icon: <Truck size={20} /> },
  { label: 'Register New Driver', href: '/dashboard/register-new-driver', icon: <Truck size={20} /> },
  { label: 'User Form', href: '/dashboard/form', icon: <FileText size={20} /> },
  { label: 'Truck Allocation', href: '/dashboard/truck-allocation', icon: <Truck size={20} /> },
  { label: 'Vehicle Tracking', href: '/dashboard/vehicle-tracking', icon: <MapPin size={20} /> },
  { label: 'Driver Score', href: '/dashboard/driver-score', icon: <Star size={20} /> },
  // { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={20} /> },
];

const Sidebar: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const location = useLocation();
  const toggleSidebar = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <div
      className={`relative border-r bg-white text-black h-screen pt-8 transition-all duration-300 ${isMinimized ? 'w-20' : 'w-64'
        }`}
    >
      {/* Toggle Button in the top-right corner */}
      <div
        className="absolute top-8 right-0 transform translate-x-1/2 bg-white border rounded-full p-1 cursor-pointer"
        onClick={toggleSidebar}
      >
        <ArrowLeft
          className={`transition-transform ${isMinimized ? 'rotate-180' : ''}`}
          size={20}
        />
      </div>

      {/* Navigation Items */}
      <ul className="space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href; // or use startsWith if needed
          return (
            <li className="mx-3" key={item.href}>
              <Link
                to={item.href}
                className={`flex items-center gap-4 px-4 py-2 transition-colors ${isActive
                    ? 'bg-blue-500 rounded-xl text-white'
                    : 'text-gray-800 hover:bg-gray-100'
                  }`}
              >
                <span>{item.icon}</span>
                {!isMinimized && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>

  
    </div>
  );
};

export default Sidebar;
