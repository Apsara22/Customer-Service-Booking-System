import {
  FaHome,
  FaTools,
  FaCalendarAlt,
  FaHistory,
  FaEnvelope,
  FaCog,
  FaQuestionCircle,
  FaChevronDown,
  FaChevronRight,
  FaLock,
} from "react-icons/fa";

import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import { serviceCategories } from "../../data/serviceCategories";

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar = ({ isSidebarOpen }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isServicesOpen, setIsServicesOpen] = useState(
    location.pathname.startsWith("/services")
  );

  // Available navigation items
  const navItems = [
    {
      icon: FaHome,
      label: "Dashboard",
      path: "/dashboard",
      available: true,
    },
    {
      icon: FaCalendarAlt,
      label: "My Bookings",
      path: "/bookings",
      available: true,
    },
    {
      icon: FaHistory,
      label: "Booking History",
      path: "/booking-history",
      available: false,
    },
    {
      icon: FaEnvelope,
      label: "Messages",
      path: "/messages",
      available: false,
    },
    {
      icon: FaCog,
      label: "Settings",
      path: "/settings",
      available: false,
    },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 z-40
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-700
        transition-transform duration-300 ease-in-out
        ${
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
        w-64 overflow-y-auto`}
    >
      <div className="p-4">

        {/* ============================= */}
        {/* CUSTOMER MENU */}
        {/* ============================= */}

        <div className="mb-6">
          <h3
            className="text-xs font-semibold
              text-gray-400 dark:text-gray-500
              uppercase tracking-wider"
          >
            Customer Menu
          </h3>
        </div>

        {/* ============================= */}
        {/* NAVIGATION ITEMS */}
        {/* ============================= */}

        <ul className="space-y-2">

          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              location.pathname === item.path;

            return (
              <li key={item.path}>

                <button
                  type="button"
                  disabled={!item.available}
                  onClick={() => {
                    if (item.available) {
                      navigate(item.path);
                    }
                  }}
                  className={`w-full flex items-center gap-3
                    px-4 py-3 rounded-lg
                    transition-all group text-left

                    ${
                      !item.available
                        ? "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60"
                        : isActive
                        ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    }
                  `}
                >

                  <Icon
                    className={`w-5 h-5 transition-colors

                      ${
                        !item.available
                          ? "text-gray-400 dark:text-gray-600"
                          : isActive
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                      }

                    `}
                  />

                  <span className="text-sm font-medium">
                    {item.label}
                  </span>

                  {/* Coming Soon / Unavailable */}
                  {!item.available && (
                    <span className="ml-auto flex items-center gap-1">
                      <FaLock className="w-3 h-3" />

                      <span className="text-[10px]">
                        Soon
                      </span>
                    </span>
                  )}

                </button>

              </li>
            );
          })}

        </ul>

        {/* ============================= */}
        {/* SERVICES */}
        {/* ============================= */}

        <div className="mt-2">

          {/* Services Main Button */}
          <button
            type="button"
            onClick={() =>
              setIsServicesOpen(!isServicesOpen)
            }
            className={`w-full flex items-center gap-3
              px-4 py-3 rounded-lg
              transition-all group

              ${
                location.pathname.startsWith("/services")
                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              }
            `}
          >

            <FaTools
              className={`w-5 h-5

                ${
                  location.pathname.startsWith("/services")
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                }

              `}
            />

            <span className="text-sm font-medium">
              Services
            </span>

            <span className="ml-auto">

              {isServicesOpen ? (
                <FaChevronDown className="w-3 h-3" />
              ) : (
                <FaChevronRight className="w-3 h-3" />
              )}

            </span>

          </button>

          {/* Service Categories */}
          {isServicesOpen && (
            <div
              className="ml-4 mt-2 pl-3
                border-l border-gray-200
                dark:border-gray-700"
            >

              {serviceCategories.map((category) => {

                const categoryPath =
                  `/services/${category.id}`;

                const isCategoryActive =
                  location.pathname === categoryPath;

                const Icon = category.icon;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      navigate(categoryPath)
                    }
                    className={`w-full flex items-center gap-3
                      px-3 py-2.5 rounded-lg
                      text-left transition-all

                      ${
                        isCategoryActive
                          ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                          : "text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
                      }
                    `}
                  >

                    <Icon
                      className={`w-4 h-4

                        ${
                          isCategoryActive
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-gray-500 dark:text-gray-400"
                        }

                      `}
                    />

                    <span className="text-sm">
                      {category.name}
                    </span>

                  </button>
                );
              })}

            </div>
          )}

        </div>

        {/* ============================= */}
        {/* HELP SECTION */}
        {/* ============================= */}

        <div
          className="mt-8 pt-6
            border-t border-gray-200
            dark:border-gray-700"
        >

          <div
            className="bg-gradient-to-r
              from-purple-600/10 to-pink-600/10
              rounded-lg p-4"
          >

            {/* Help Header */}
            <div className="flex items-center gap-3 mb-2">

              <div
                className="w-10 h-10
                  bg-gradient-to-r from-purple-600 to-pink-600
                  rounded-lg flex items-center justify-center"
              >
                <FaQuestionCircle
                  className="text-white w-5 h-5"
                />
              </div>

              <div>

                <p
                  className="text-sm font-semibold
                    text-gray-800 dark:text-white"
                >
                  Need Help?
                </p>

                <p
                  className="text-xs
                    text-gray-500 dark:text-gray-400"
                >
                  Contact support
                </p>

              </div>

            </div>

            {/* Help Button */}
            <button
              type="button"
              onClick={() => navigate("/support")}
              className="w-full mt-2
                bg-gradient-to-r from-purple-600 to-pink-600
                text-white text-sm py-2 rounded-lg
                hover:shadow-lg transition-shadow"
            >
              Get Help
            </button>

          </div>

        </div>

      </div>
    </aside>
  );
};

export default Sidebar;