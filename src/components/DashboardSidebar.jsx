import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaBriefcase, 
  FaUsers, 
  FaClock, 
  FaBuilding, 
  FaTimes 
} from 'react-icons/fa';
import { cn } from '../lib/utils';

export const DashboardSidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { icon: <FaHome className="w-5 h-5" />, label: 'Dashboard', href: '/new-dashboard' },
    { icon: <FaBriefcase className="w-5 h-5" />, label: 'Job Listings', href: '/employer-job-management' },
    { icon: <FaUsers className="w-5 h-5" />, label: 'Applicants', href: '/employer-job-applicants/all' },
    { icon: <FaClock className="w-5 h-5" />, label: 'Timesheets', href: '/timesheet/approval' },
    { icon: <FaBuilding className="w-5 h-5" />, label: 'Company Info', href: '/employer-dashboard' },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center">
            <img 
              src="/vite.svg" 
              alt="Logo" 
              className="w-8 h-8 mr-2" 
            />
            <span className="text-xl font-semibold">Resumer</span>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <nav className="px-4 py-6">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors"
                >
                  <span className="mr-3 text-gray-500">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;