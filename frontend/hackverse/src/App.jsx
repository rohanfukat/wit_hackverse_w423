import React, { useState, createContext, useContext } from "react";
import "./index.css"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import CoPODashboard from "./pages/CoPODashboard";
import Analytics from "./pages/Analytics";
import AddSubs from "./pages/AddSubs";
import CoPOMapping from "./pages/CoPOMapping";
import CoPOAttainment from "./pages/CoPOAttainment";
import ExamPaperEvaluation from "./pages/ExamPaperEvaluation";
import HomePage from './pages/HomePage';
import Attainment from './pages/Attainment'

// Create a context for dark mode
export const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

// Higher-Order Component to apply dark mode to pages
const withTheme = (WrappedComponent) => {
  return (props) => {
    const { isDarkMode } = useContext(ThemeContext);

    return (
      <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
        <WrappedComponent
          {...props}
          className={`
            transition-colors duration-300 
            ${
              isDarkMode
                ? "bg-gray-800 text-gray-100"
                : "bg-gray-50 text-gray-900"
            }
          `}
        />
      </div>
    );
  };
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply theme wrapper to all page components
  const ThemedCoPODashboard = withTheme(CoPODashboard);
  const ThemedCoPOMapping = withTheme(CoPOMapping);
  const ThemedCoPOAttainment = withTheme(CoPOAttainment);
  const ThemedAnalytics = withTheme(Analytics);
  const ThemedExamPaperEvaluation = withTheme(ExamPaperEvaluation);
  const ThemedAddSubs = withTheme(AddSubs);  
  const ThemedHomePage = withTheme(HomePage);
  const ThemedAttainment = withTheme(Attainment);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <Router>
        <Routes>
          {/* Homepage will be fullscreen without Navbar */}
          <Route path="/" element={<Navigate to="/homepage" replace />} />
          
          <Route path="/homepage" element={<ThemedHomePage />} />
          
          {/* Other routes will have Navbar */}
          <Route 
            path="/*" 
            element={
              <div className={`flex min-h-screen ${isDarkMode ? "dark" : ""}`}>
                <Navbar />
                <main className={`w-4/5 ml-auto`}>
                  <Routes>
                    <Route path="/dashboard" element={<ThemedCoPODashboard />} />
                    <Route path="/co-po-mapping" element={<ThemedCoPOMapping />} />
                    <Route
                      path="/co-po-attainment"
                      element={<ThemedCoPOAttainment />}
                    />
                    <Route path="/analytics" element={<ThemedAnalytics />} />
                    <Route
                      path="/exam-paper-evaluation"
                      element={<ThemedExamPaperEvaluation />}
                    />
                    <Route path="/addsubs" element={<ThemedAddSubs />} />
                    <Route path="/attainment" element={<Attainment />} />
                  </Routes>
                </main>
              </div>
            } 
          />
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;