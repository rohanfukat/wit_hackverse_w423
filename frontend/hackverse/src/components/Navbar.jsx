import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  TrendingUp,
  BookPlus,
  Navigation,
  ClipboardList,
  FileSpreadsheet,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { ThemeContext } from "../App";

// Create a UserContext (you can expand this later)
export const UserContext = React.createContext({
  userName: "Anonymous",
  userRole: "User",
  department: "Computer Science"
});

const Navbar = () => {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  
  // Default to 'Student' if no context is provided
  const { userName = "Anonymous" } = useContext(UserContext);

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home />,
      alternateIcons: ["/", "/dashboard"],
    },
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
      name: "Add Subjects",
      path: "/addsubs",
      icon: <BookPlus />,
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
            w-32 h-32 rounded-full overflow-hidden mb-4 border-4 flex items-center justify-center
            ${isDarkMode 
              ? "border-green-600 bg-gray-700" 
              : "border-green-500 bg-gray-100"
            }
          `}
        >
          <User 
            size={80} 
            className={`
              ${isDarkMode 
                ? "text-gray-400" 
                : "text-gray-500"
              }
            `} 
          />
        </div>
        <h3
          className={`text-xl font-semibold text-center w-full truncate ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {userName}
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