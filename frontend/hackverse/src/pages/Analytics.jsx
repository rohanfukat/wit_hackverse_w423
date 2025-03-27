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
  Cpu
} from 'lucide-react';

const AnalyticsWelcome = ({ isDarkMode, onSearch }) => {
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
        ${isDarkMode
            ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
            : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900"
        }
      `}
    >
      <div className="max-w-4xl w-full">
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
            ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
          `}>
            Discover insights by searching courses across multiple dimensions
          </p>
        </div>

        <div className="mb-12 max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Course Name"
              value={searchFieldsState.courseName}
              onChange={(e) => handleFieldChange('courseName', e.target.value)}
              className={`
                w-full p-3 rounded-lg shadow-lg focus:ring-4 transition-all
                ${isDarkMode
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
                ${isDarkMode
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
                ${isDarkMode
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
                ${isDarkMode
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
              ${Object.values(searchFieldsState).some(value => value.trim() !== '')
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
                ${isDarkMode
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
                  ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
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
  const [searchFields, setSearchFields] = useState({
    courseName: '',
    courseId: '',
    semester: '',
    subject: ''
  });
  const [pocoData, setPOCOData] = useState({ barChartData: [], pieChartData: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [rawData, setRawData] = useState([]);

  const getRankColor = (rank, isDarkMode) => {
    switch (rank) {
      case "3":
        return isDarkMode 
          ? "bg-green-900/50 text-green-300" 
          : "bg-green-100 text-green-800";
      case "2":
        return isDarkMode 
          ? "bg-yellow-900/50 text-yellow-300" 
          : "bg-yellow-100 text-yellow-800";
      case "1":
        return isDarkMode 
          ? "bg-red-900/50 text-red-300" 
          : "bg-red-100 text-red-800";
      default:
        return isDarkMode 
          ? "bg-gray-900/50 text-gray-300" 
          : "bg-gray-100 text-gray-800";
    }
  };

  const processChartData = (data) => {
    // Count POs and their ranks
    const poRankData = {};
    data.forEach(item => {
      item.Mapped_POs.forEach(po => {
        if (!poRankData[po.PO]) {
          poRankData[po.PO] = {
            poName: po.PO,
            highCount: 0,
            mediumCount: 0,
            lowCount: 0,
            total: 0
          };
        }
        
        switch (po.Rank) {
          case "3":
            poRankData[po.PO].highCount++;
            break;
          case "2":
            poRankData[po.PO].mediumCount++;
            break;
          case "1":
            poRankData[po.PO].lowCount++;
            break;
        }
        poRankData[po.PO].total++;
      });
    });

    // Transform for bar chart
    const barChartData = Object.values(poRankData).map(item => ({
      po: item.poName,
      High: item.highCount,
      Medium: item.mediumCount,
      Low: item.lowCount
    }));

    // Transform for pie chart
    const bloomLevelCount = {};
    data.forEach(item => {
      bloomLevelCount[item.Bloom_Level] = (bloomLevelCount[item.Bloom_Level] || 0) + 1;
    });

    const pieChartData = Object.entries(bloomLevelCount).map(([level, count]) => ({
      name: level,
      value: count
    }));

    return { barChartData, pieChartData };
  };

  const sendSearchData = async (searchData) => {
    try {
      if (!searchData.subject) {
        throw new Error("Subject is required");
      }

      const response = await fetch("http://127.0.0.1:8000/get_mapping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: searchData.subject
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error sending search data:", error);
      throw error;
    }
  };

  const handleSearch = async (searchData) => {
    setSearchFields(searchData);
    setIsAnalyzing(true);
    setIsLoading(true);
    setError(null);

    try {
      if (!searchData.subject) {
        throw new Error("Subject is required");
      }

      const response = await sendSearchData(searchData);
      if (response) {
        setRawData(response);
        const processedData = processChartData(response);
        setPOCOData(processedData);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch data');
      setPOCOData({ barChartData: [], pieChartData: [] });
      setRawData([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAnalyzing) {
    return (
      <AnalyticsWelcome 
        isDarkMode={isDarkMode} 
        onSearch={handleSearch} 
      />
    );
  }

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#8884D8', '#82CA9D', '#FF6384', '#36A2EB'
  ];

  return (
    <div
      className={`
        min-h-screen p-6 transition-all duration-300
        ${isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900"
        }
        ${className}
      `}
    >
      <div className="mb-6 max-w-2xl mx-auto">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter course details for analysis"
            value={Object.values(searchFields).filter(v => v).join(', ')}
            readOnly
            className={`
              w-full p-3 rounded-lg shadow-md focus:ring-2 transition-all
              ${isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-300 focus:ring-blue-500"
                : "bg-white border-gray-300 text-gray-700 focus:ring-blue-400"
              }
            `}
          />
          <button
            onClick={() => setIsAnalyzing(false)}
            className={`
              px-6 py-3 rounded-lg flex items-center space-x-2 transition-all
              ${isDarkMode
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
            text-center mt-4 p-3 rounded-lg
            ${isDarkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600'}
          `}>
            {error}
          </div>
        )}
      </div>

      {!isLoading && pocoData.barChartData?.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          <div
            className={`
              p-6 rounded-xl shadow-2xl transition-all
              ${isDarkMode
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
                PO-CO Mapping Analysis
              </h2>
            </div>
            
            <div className="mb-6">
              <h3 className={`
                text-lg font-semibold mb-4 flex items-center space-x-2
                ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}
              `}>
                <BarChartIcon className="w-5 h-5" />
                <span>PO Achievement Levels Distribution</span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pocoData.barChartData}>
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
                    contentStyle={{
                      backgroundColor: isDarkMode
                        ? "rgba(31, 41, 55, 0.9)"
                        : "rgba(55, 65, 81, 0.9)",
                      color: "white",
                      borderRadius: "12px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="High" fill="#00C49F" name="High (3)" stackId="a" />
                  <Bar dataKey="Medium" fill="#FFBB28" name="Medium (2)" stackId="a" />
                  <Bar dataKey="Low" fill="#FF8042" name="Low (1)" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className={`
                text-lg font-semibold mb-4 flex items-center space-x-2
                ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}
              `}>
                <PieChartIcon className="w-5 h-5" />
                <span>Bloom's Taxonomy Level Distribution</span>
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pocoData.pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => 
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {pocoData.pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
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

            <div className="mt-8">
              <h3 className={`
                text-lg font-semibold mb-4 flex items-center space-x-2
                ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}
              `}>
                <DatabaseZap className="w-5 h-5" />
                <span>Course Outcomes and PO Mappings</span>
              </h3>
              
              <div className="overflow-x-auto">
                <table className={`
                  min-w-full divide-y divide-gray-200
                  ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}
                `}>
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        CO Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        CO Objective
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Bloom's Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Mapped POs
                      </th>
                    </tr>
                  </thead>
                  <tbody className={`
                    divide-y divide-gray-200
                    ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}
                  `}>
                    {rawData.map((item, index) => (
                      <tr key={index} className={
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }>
                        <td className="px-6 py-4 whitespace-nowrap">
                          CO{item.CO_number}
                        </td>
                        <td className="px-6 py-4">
                          {item.CO_Objective}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.Bloom_Level}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {item.Mapped_POs.map((po, poIndex) => (
                              <span
                                key={poIndex}
                                className={`
                                  px-2 py-1 rounded-full text-xs font-medium
                                  ${getRankColor(po.Rank, isDarkMode)}
                                `}
                              >
                                {po.PO} (Rank: {po.Rank})
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;