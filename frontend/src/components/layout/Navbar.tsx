// Navbar.tsx
import React, { useState, createContext, useContext } from "react";
import {
  FaUser,
  FaCog,
  FaBell,
  FaSearch,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaQuestionCircle,
} from "react-icons/fa";

import Sidebar from "./Sidebar";

// Create context for sidebar state
export const SidebarContext = createContext<{
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}>({
  isSidebarOpen: false,
  toggleSidebar: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

// Provider lives on its own so it can wrap BOTH Navbar and the routed pages
export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

const Navbar = () => {
  // Consume shared sidebar state instead of owning it locally
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Toggle Profile Dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-4 h-16 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Hamburger Button */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <FaTimes className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <FaBars className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CS</span>
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">
                Customer Service
              </span>
            </div>
          </div>

          {/* Center Section - Search */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2
                  bg-gray-100 dark:bg-gray-800
                  border border-gray-200 dark:border-gray-700
                  rounded-lg
                  focus:outline-none
                  focus:ring-2 focus:ring-purple-500
                  dark:focus:ring-purple-400
                  transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <FaSun className="w-5 h-5 text-yellow-500" />
              ) : (
                <FaMoon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
              <FaBell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <FaChevronDown
                  className={`w-4 h-4 text-gray-700 dark:text-gray-300 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-fade-in-up">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      John Doe
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      john.doe@email.com
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors">
                      <FaUser className="w-4 h-4" />
                      Profile
                    </button>
                    <button className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors">
                      <FaCog className="w-4 h-4" />
                      Settings
                    </button>
                    <button className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors">
                      <FaQuestionCircle className="w-4 h-4" />
                      Help
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                    <button className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 transition-colors">
                      <FaSignOutAlt className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Bottom Navigation - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden">
        <div className="flex justify-around items-center h-16">
          <button className="flex flex-col items-center gap-1 text-purple-600 dark:text-purple-400">
            <FaSearch className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            <FaSearch className="w-5 h-5" />
            <span className="text-[10px] font-medium">Search</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative">
            <FaBell className="w-5 h-5" />
            <span className="text-[10px] font-medium">Alerts</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            <FaUser className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Spacer */}
      <div className="h-16"></div>
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default Navbar;