import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  TrendingUp,
  Settings,
  Navigation,
  ClipboardList,
  FileSpreadsheet,
  Moon,
  Sun,
} from "lucide-react";
import { ThemeContext } from "../App";

const Navbar = () => {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home />,
      alternateIcons: ["/", "/dashboard"],
    },
    // {
    //   name: "Co-Po Mapping",
    //   path: "/co-po-mapping",
    //   icon: <Navigation />,
    // },
    // {
    //   name: "Co-Po Attainment",
    //   path: "/co-po-attainment",
    //   icon: <ClipboardList />,
    // },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <TrendingUp />,
    },
    {
      name: "Exam Paper Evaluation",
      path: "/exam-paper-evaluation",
      icon: <FileSpreadsheet />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings />,
    },
  ];

  const isActive = (path, alternateIcons = []) => {
    return (
      location.pathname === path || alternateIcons.includes(location.pathname)
    );
  };

  return (
    <div
      className={`
        fixed left-0 top-0 bottom-0 w-1/5 min-w-[250px] z-10 h-full p-8 shadow-md
        transition-colors duration-300
        ${
          isDarkMode
            ? "bg-gray-900 text-gray-100 border-r border-gray-700"
            : "bg-white text-gray-900 border-r border-gray-200"
        }
      `}
    >
      {/* Theme Toggle Button - Top Left */}
      <div className="absolute top-4 left-4">
        <button
          onClick={toggleDarkMode}
          className={`
            p-2 rounded-full transition-all duration-300
            ${
              isDarkMode
                ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }
          `}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* User Profile */}
      <div className="flex flex-col items-center mb-8">
        <div
          className={`
            w-32 h-32 rounded-full overflow-hidden mb-4 border-4
            ${isDarkMode ? "border-green-600" : "border-green-500"}
          `}
        >
          <img
            src="/api/placeholder/128/128"
            alt="User Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h3
          className={`text-xl font-semibold ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          John Doe
        </h3>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col w-full gap-4 mb-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center w-full p-3 rounded-lg transition-all duration-300 ease-in-out
              ${
                isActive(item.path, item.alternateIcons)
                  ? isDarkMode
                    ? "bg-green-600 text-white"
                    : "bg-green-500 text-white"
                  : isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }
            `}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
