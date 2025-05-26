import React, { useState } from 'react';
import { FaBars, FaSearch, FaBell, FaUser } from 'react-icons/fa';
import { Input } from './ui/input';
import { Button } from './ui/button';

export const DashboardHeader = ({ toggleSidebar }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Menu button and search */}
          <div className="flex items-center flex-1">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <FaBars className="w-5 h-5" />
            </button>
            
            <div className="ml-4 flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 py-2 w-full"
                />
              </div>
            </div>
          </div>

          {/* Right: Notifications and profile */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <FaBell className="h-5 w-5 text-gray-500" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden">
                  <FaUser className="h-5 w-5" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  John Doe
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                  <a
                    href="#profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <a
                    href="#signout"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;