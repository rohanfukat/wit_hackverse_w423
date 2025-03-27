import React, { useState, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { ThemeContext } from "../App";

const Analytics = ({ className }) => {
  const { isDarkMode } = useContext(ThemeContext);

  // Initial sample data
  const [pocoData, setPOCOData] = useState([
    { po: 'PO1', mappedCOs: ['CO1', 'CO2', 'CO3'] },
    { po: 'PO2', mappedCOs: ['CO2', 'CO4'] },
    { po: 'PO3', mappedCOs: ['CO1', 'CO5'] },
    { po: 'PO4', mappedCOs: ['CO3', 'CO6'] },
    { po: 'PO5', mappedCOs: ['CO4', 'CO7'] },
    { po: 'PO6', mappedCOs: ['CO5', 'CO8'] },
    { po: 'PO7', mappedCOs: ['CO6', 'CO9'] },
    { po: 'PO8', mappedCOs: ['CO7', 'CO10'] },
    { po: 'PO9', mappedCOs: ['CO8', 'CO11'] },
    { po: 'PO10', mappedCOs: ['CO9', 'CO12'] },
    { po: 'PO11', mappedCOs: ['CO10'] },
    { po: 'PO12', mappedCOs: ['CO11', 'CO12'] }
  ]);

  // State for new PO and CO input
  const [newPO, setNewPO] = useState('');
  const [newCO, setNewCO] = useState('');
  const [poToMap, setPOToMap] = useState('');

  // Prepare data for the bar chart
  const chartData = pocoData.map(item => ({
    po: item.po,
    mappedCOCount: item.mappedCOs.length
  }));

  // Prepare data for the pie chart
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

  // Add a new PO
  const handleAddPO = () => {
    if (newPO && !pocoData.some(item => item.po === newPO)) {
      setPOCOData([...pocoData, { po: newPO, mappedCOs: [] }]);
      setNewPO('');
    }
  };

  // Map a CO to a PO
  const handleMapCO = () => {
    if (newCO && poToMap) {
      setPOCOData(prevData =>
        prevData.map(item =>
          item.po === poToMap
            ? { ...item, mappedCOs: [...item.mappedCOs, newCO] }
            : item
        )
      );
      setNewCO('');
      setPOToMap('');
    }
  };

  return (
    <div
      className={`
        min-h-screen p-6
        ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
            : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900"
        }
        ${className}
      `}
    >
      <div className="grid md:grid-cols-[2fr_1fr] gap-6 mb-6">
        {/* Visualization Panel */}
        <div
          className={`
            p-6 rounded-xl shadow-lg
            ${
              isDarkMode
                ? "bg-gray-800 border-l-4 border-green-600"
                : "bg-white border-l-4 border-green-500"
            }
          `}
        >
          <h2 className="text-xl font-semibold mb-4">PO-CO Mapping Visualization</h2>
          
          {/* Bar Chart */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">PO Mapped COs Distribution</h3>
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
            <h3 className="text-lg font-semibold mb-4">CO Mapping Frequency</h3>
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

        {/* Data Management Panel */}
        <div
          className={`
            p-6 rounded-xl shadow-lg
            ${
              isDarkMode
                ? "bg-gray-800 border-l-4 border-indigo-600"
                : "bg-white border-l-4 border-indigo-500"
            }
          `}
        >
          <h2 className="text-xl font-semibold mb-4">Mapping Management</h2>
          
          {/* Add New PO */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Add New PO</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter PO (e.g., PO13)"
                value={newPO}
                onChange={(e) => setNewPO(e.target.value)}
                className={`
                  w-full p-2 border rounded
                  ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-white border-gray-300 text-gray-900"
                  }
                `}
              />
              <button
                onClick={handleAddPO}
                className={`
                  px-4 py-2 rounded
                  ${
                    isDarkMode
                      ? "bg-blue-700 text-blue-100 hover:bg-blue-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }
                `}
              >
                Add PO
              </button>
            </div>
          </div>

          {/* Map CO to PO */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Map CO to PO</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter CO (e.g., CO13)"
                value={newCO}
                onChange={(e) => setNewCO(e.target.value)}
                className={`
                  w-full p-2 border rounded
                  ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-white border-gray-300 text-gray-900"
                  }
                `}
              />
              <select
                value={poToMap}
                onChange={(e) => setPOToMap(e.target.value)}
                className={`
                  w-full p-2 border rounded
                  ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-white border-gray-300 text-gray-900"
                  }
                `}
              >
                <option value="">Select PO to Map</option>
                {pocoData.map(item => (
                  <option key={item.po} value={item.po}>{item.po}</option>
                ))}
              </select>
              <button
                onClick={handleMapCO}
                className={`
                  w-full px-4 py-2 rounded
                  ${
                    isDarkMode
                      ? "bg-green-700 text-green-100 hover:bg-green-600"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }
                `}
              >
                Map CO to PO
              </button>
            </div>
          </div>

          {/* Current Mappings */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Current Mappings</h3>
            <div 
              className={`
                max-h-48 overflow-y-auto border rounded p-2
                ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }
              `}
            >
              {pocoData.map(item => (
                <div key={item.po} className="mb-1">
                  <strong>{item.po}:</strong> {item.mappedCOs.join(', ')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;