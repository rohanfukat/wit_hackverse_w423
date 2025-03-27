import React, { useState, useContext, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { ThemeContext } from "../App";
import { 
  Search, 
  DatabaseZap, 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon, 
  Target, 
  TrendingUp,
  Cpu  // CPU icon for Machine Learning
} from 'lucide-react';

const AnalyticsWelcome = ({ isDarkMode, onSearch }) => {
  const [searchFields, setSearchFields] = useState({
    courseName: '',
    courseId: '',
    semester: '',
    subject: ''
  });

  const sampleSearches = [
    { 
      name: "Computer Science", 
      icon: <Target className="w-12 h-12 text-blue-500" />,
      details: {
        courseName: "Advanced Programming",
        courseId: "CS302",
        semester: "Fall 2024",
        subject: "Computer Science"
      }
    },
    { 
      name: "Business Analytics", 
      icon: <TrendingUp className="w-12 h-12 text-green-500" />,
      details: {
        courseName: "Data-Driven Decision Making",
        courseId: "BUS405",
        semester: "Spring 2024",
        subject: "Business"
      }
    },
    { 
      name: "Machine Learning", 
      icon: <Cpu className="w-12 h-12 text-purple-500" />,
      details: {
        courseName: "Neural Networks",
        courseId: "ML201",
        semester: "Summer 2024",
        subject: "Machine Learning"
      }
    }
  ];

  const [searchFieldsState, setSearchFieldsState] = useState({
    courseName: '',
    courseId: '',
    semester: '',
    subject: ''
  });

  const handleFieldChange = (field, value) => {
    setSearchFieldsState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    const hasSearchValue = Object.values(searchFieldsState).some(value => value.trim() !== '');
    if (hasSearchValue) {
      onSearch(searchFieldsState);
    }
  };

  return (
    <div 
      className={`
        min-h-screen flex flex-col justify-center items-center p-6 transition-all duration-300
        ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
            : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900"
        }
      `}
    >
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className={`
            text-4xl font-bold mb-4 flex justify-center items-center space-x-3
            ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}
          `}>
            <DatabaseZap className="w-12 h-12 text-indigo-500" />
            <span>Intelligent Course Analytics Dashboard</span>
          </h1>
          <p className={`
            text-xl max-w-2xl mx-auto
            ${
              isDarkMode 
                ? 'text-gray-300' 
                : 'text-gray-600'
            }
          `}>
            Discover insights by searching courses across multiple dimensions
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Course Name"
              value={searchFieldsState.courseName}
              onChange={(e) => handleFieldChange('courseName', e.target.value)}
              className={`
                w-full p-3 rounded-lg shadow-lg focus:ring-4 transition-all
                ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500/50 placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400/50 placeholder-gray-500"
                }
              `}
            />
            <input
              type="text"
              placeholder="Course ID"
              value={searchFieldsState.courseId}
              onChange={(e) => handleFieldChange('courseId', e.target.value)}
              className={`
                w-full p-3 rounded-lg shadow-lg focus:ring-4 transition-all
                ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500/50 placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400/50 placeholder-gray-500"
                }
              `}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Semester"
              value={searchFieldsState.semester}
              onChange={(e) => handleFieldChange('semester', e.target.value)}
              className={`
                w-full p-3 rounded-lg shadow-lg focus:ring-4 transition-all
                ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500/50 placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400/50 placeholder-gray-500"
                }
              `}
            />
            <input
              type="text"
              placeholder="Subject"
              value={searchFieldsState.subject}
              onChange={(e) => handleFieldChange('subject', e.target.value)}
              className={`
                w-full p-3 rounded-lg shadow-lg focus:ring-4 transition-all
                ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-500/50 placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400/50 placeholder-gray-500"
                }
              `}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!Object.values(searchFieldsState).some(value => value.trim() !== '')}
            className={`
              w-full px-6 py-4 rounded-lg flex items-center justify-center space-x-2 transition-all
              ${
                Object.values(searchFieldsState).some(value => value.trim() !== '')
                  ? (isDarkMode
                      ? "bg-blue-700 text-blue-100 hover:bg-blue-600"
                      : "bg-blue-500 text-white hover:bg-blue-600")
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }
            `}
          >
            <Search className="w-6 h-6" />
            <span>Analyze</span>
          </button>
        </div>

        {/* Sample Subjects Section */}
        <div className="grid md:grid-cols-3 gap-6">
          {sampleSearches.map((sample) => (
            <div 
              key={sample.name}
              onClick={() => {
                setSearchFieldsState(sample.details);
                onSearch(sample.details);
              }}
              className={`
                p-6 rounded-xl shadow-lg cursor-pointer transition-all 
                hover:scale-105 hover:shadow-xl group
                ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-50"
                }
              `}
            >
              <div className="flex flex-col items-center text-center">
                {sample.icon}
                <h3 className={`
                  text-xl font-semibold mt-4 mb-2 group-hover:text-blue-600 transition-colors
                  ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}
                `}>
                  {sample.name}
                </h3>
                <div className={`
                  ${
                    isDarkMode 
                      ? 'text-gray-400' 
                      : 'text-gray-600'
                  }
                `}>
                  <p>{sample.details.courseName}</p>
                  <p>{sample.details.courseId}</p>
                  <p>{sample.details.semester}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Analytics = ({ className }) => {
  const { isDarkMode } = useContext(ThemeContext);

  // State for search fields and data
  const [searchFields, setSearchFields] = useState({
    courseName: '',
    courseId: '',
    semester: '',
    subject: ''
  });
  const [pocoData, setPOCOData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Handle subject search
  const handleSearch = (searchData) => {
    setSearchFields(searchData);
    setIsAnalyzing(true);
    fetchDataForSearch(searchData);
  };

  // Fetch data based on search fields
  const fetchDataForSearch = async (searchData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulated backend fetch - replace with actual API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: () => Promise.resolve([
              { 
                po: `${searchData.courseName || 'Course'} PO1`, 
                mappedCOs: [`${searchData.subject || 'Subject'} CO1`, `${searchData.subject || 'Subject'} CO2`] 
              },
              { 
                po: `${searchData.courseName || 'Course'} PO2`, 
                mappedCOs: [`${searchData.subject || 'Subject'} CO2`, `${searchData.subject || 'Subject'} CO3`] 
              },
              { 
                po: `${searchData.courseName || 'Course'} PO3`, 
                mappedCOs: [`${searchData.subject || 'Subject'} CO1`, `${searchData.subject || 'Subject'} CO4`] 
              },
            ])
          });
        }, 1000);
      });
      
      const data = await response.json();
      setPOCOData(data);
    } catch (err) {
      setError('Unable to fetch data. Please try again.');
      // Fallback to default data if fetch fails
      setPOCOData([
        { 
          po: `${searchData.courseName || 'Course'} PO1`, 
          mappedCOs: [`${searchData.subject || 'Subject'} CO1`, `${searchData.subject || 'Subject'} CO2`] 
        },
        { 
          po: `${searchData.courseName || 'Course'} PO2`, 
          mappedCOs: [`${searchData.subject || 'Subject'} CO2`, `${searchData.subject || 'Subject'} CO3`] 
        },
        { 
          po: `${searchData.courseName || 'Course'} PO3`, 
          mappedCOs: [`${searchData.subject || 'Subject'} CO1`, `${searchData.subject || 'Subject'} CO4`] 
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // If no search has been performed, show the welcome screen
  if (!isAnalyzing) {
    return (
      <AnalyticsWelcome 
        isDarkMode={isDarkMode} 
        onSearch={handleSearch} 
      />
    );
  }

  // Prepare data for charts
  const chartData = pocoData.map(item => ({
    po: item.po,
    mappedCOCount: item.mappedCOs.length
  }));

  const coDistribution = {};
  pocoData.forEach(item => {
    item.mappedCOs.forEach(co => {
      coDistribution[co] = (coDistribution[co] || 0) + 1;
    });
  });

  const pieChartData = Object.entries(coDistribution).map(([co, count]) => ({
    co,
    count
  }));

  // Color palette for pie chart
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#8884D8', '#82CA9D', '#FF6384', '#36A2EB'
  ];

  return (
    <div
      className={`
        min-h-screen p-6 transition-all duration-300
        ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
            : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900"
        }
        ${className}
      `}
    >
      {/* Subject Search Section */}
      <div className="mb-6 max-w-2xl mx-auto">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter course details for analysis"
            value={Object.values(searchFields).filter(v => v).join(', ')}
            readOnly
            className={`
              w-full p-3 rounded-lg shadow-md focus:ring-2 transition-all
              ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-300 focus:ring-blue-500"
                  : "bg-white border-gray-300 text-gray-700 focus:ring-blue-400"
              }
            `}
          />
          <button
            onClick={() => setIsAnalyzing(false)}
            className={`
              px-6 py-3 rounded-lg flex items-center space-x-2 transition-all
              ${
                isDarkMode
                  ? "bg-blue-700 text-blue-100 hover:bg-blue-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }
            `}
          >
            <Search className="w-5 h-5" />
            <span>Modify Search</span>
          </button>
        </div>
        {isLoading && (
          <div className={`
            text-center mt-4 flex justify-center items-center space-x-2
            ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
          `}>
            <DatabaseZap className="animate-pulse text-blue-500" />
            <p>Fetching data...</p>
          </div>
        )}
        {error && (
          <div className={`
            text-center mt-4
            ${isDarkMode ? 'text-red-400' : 'text-red-600'}
          `}>
            {error}
          </div>
        )}
      </div>

      {/* Analytics Dashboard */}
      {pocoData.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {/* Visualization Panel */}
          <div
            className={`
              p-6 rounded-xl shadow-2xl transition-all
              ${
                isDarkMode
                  ? "bg-gray-800 border-l-4 border-green-600"
                  : "bg-white border-l-4 border-green-500"
              }
            `}
          >
            <div className={`
              flex items-center mb-4 space-x-2
              ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}
            `}>
              <BarChartIcon className="w-6 h-6" />
              <h2 className="text-xl font-semibold">
                PO-CO Mapping Visualization
              </h2>
            </div>
            
            {/* Bar Chart */}
            <div className="mb-6">
              <h3 className={`
                text-lg font-semibold mb-4 flex items-center space-x-2
                ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}
              `}>
                <BarChartIcon className="w-5 h-5" />
                <span>PO Mapped COs Distribution</span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={isDarkMode ? "#374151" : "#e2e8f0"}
                  />
                  <XAxis 
                    dataKey="po" 
                    stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  />
                  <YAxis 
                    stroke={isDarkMode ? "#9CA3AF" : "#6B7280"}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: isDarkMode
                        ? "rgba(31, 41, 55, 0.9)"
                        : "rgba(55, 65, 81, 0.9)",
                      color: "white",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="mappedCOCount" fill="#8884d8" name="Mapped COs" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div>
              <h3 className={`
                text-lg font-semibold mb-4 flex items-center space-x-2
                ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}
              `}>
                <PieChartIcon className="w-5 h-5" />
                <span>CO Mapping Frequency</span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ co, percent }) => `${co} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.co}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode
                        ? "rgba(31, 41, 55, 0.9)"
                        : "rgba(55, 65, 81, 0.9)",
                      color: "white",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;