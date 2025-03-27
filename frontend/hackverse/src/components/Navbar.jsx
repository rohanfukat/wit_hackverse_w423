import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  TrendingUp,
  BookPlus,
  Navigation,
  ClipboardList,
  FileSpreadsheet,
  BarChart2,  // Added for Attainment icon
  Moon,
  Sun,
  User,
  LogOut,
  X,
  Check
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
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  
  // State to manage username and logout confirmation
  const [userName, setUserName] = useState("Anonymous");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    // Check if there's a username passed through navigation state
    const state = location.state;
    if (state && state.extractedUsername) {
      setUserName(state.extractedUsername);
    }
  }, [location.state]);

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
      name: "Attainment",  // New navigation item
      path: "/attainment",
      icon: <BarChart2 />,
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

  const handleLogout = () => {
    // Clear any authentication tokens or user data here
    // For example:
    // localStorage.removeItem('authToken');
    // Clear any user-related context or state

    // Redirect to homepage
    navigate('/');
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
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div 
          className={`
            fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50
            ${isDarkMode ? "bg-opacity-70" : "bg-opacity-50"}
          `}
        >
          <div 
            className={`
              p-6 rounded-lg shadow-xl w-96 
              ${isDarkMode 
                ? "bg-gray-800 text-gray-100" 
                : "bg-white text-gray-900"
              }
            `}
          >
            <h2 className="text-xl font-semibold mb-4">Are you sure you want to logout?</h2>
            <p 
              className={`
                mb-6 
                ${isDarkMode ? "text-gray-300" : "text-gray-600"}
              `}
            >
              You will be redirected to the homepage and will need to log in again to access your account.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={`
                  px-4 py-2 rounded-md flex items-center
                  ${isDarkMode 
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }
                `}
              >
                <X className="mr-2" size={18} /> Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className={`
                  px-4 py-2 rounded-md flex items-center
                  ${isDarkMode 
                    ? "bg-red-800 text-gray-200 hover:bg-red-700" 
                    : "bg-red-500 text-white hover:bg-red-600"
                  }
                `}
              >
                <Check className="mr-2" size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Logout Button with Confirmation */}
      <button 
        onClick={() => setShowLogoutConfirm(true)}
        className={`
          w-full flex items-center justify-center p-3 rounded-lg transition-all duration-300 ease-in-out
          ${isDarkMode 
            ? "bg-red-800 text-gray-200 hover:bg-red-700" 
            : "bg-red-500 text-white hover:bg-red-600"
          }
        `}
      >
        <LogOut className="mr-2" size={20} /> Logout
      </button>
    </div>
  );
};

export default Navbar;