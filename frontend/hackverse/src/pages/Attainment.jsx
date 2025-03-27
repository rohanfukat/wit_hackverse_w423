import React, { useContext, useState } from "react";
import { ThemeContext } from "../App";
import { FileUp, BookOpen, BarChart2, CheckCircle, X, Send } from "lucide-react";

const AttainmentAnalysis = ({ className }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [subject, setSubject] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [attainmentResults, setAttainmentResults] = useState(null);
  
  // Popup and error states
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState('success');

  // Static Course Outcomes (CO) for demonstration
  const courseOutcomes = Array.from({ length: 5 }, (_, i) => ({
    co: `CO${i + 1}`,
    description: `Course Outcome ${i + 1} Description`,
    target: 70  // Default attainment target
  }));

  // Popup Component
  const Popup = ({ message, type }) => {
    return (
      <div 
        className={`
          fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center
          transition-all duration-300 transform 
          ${type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
          }
        `}
      >
        {type === 'success' ? (
          <CheckCircle className="mr-2" />
        ) : (
          <X className="mr-2" />
        )}
        {message}
      </div>
    );
  };

  // Show popup with message and type
  const showPopup = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);

    // Automatically clear popup after 3 seconds
    setTimeout(() => {
      setPopupMessage(null);
    }, 3000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setExcelFile(file);
  };

  const calculateAttainment = () => {
    // Validate inputs
    if (!subject) {
      showPopup('Please enter a subject name', 'error');
      return;
    }

    if (!excelFile) {
      showPopup('Please upload an Excel file', 'error');
      return;
    }

    // Simulate attainment calculation
    const mockAttainment = courseOutcomes.map(co => {
      const studentsPassing = Math.floor(Math.random() * 30) + 20;  // 20-50 students passing
      const totalStudents = 50;
      const attainmentPercentage = Math.round((studentsPassing / totalStudents) * 100);
      
      return {
        ...co,
        studentsPassing,
        totalStudents,
        attainmentPercentage,
        status: attainmentPercentage >= co.target ? 'Achieved' : 'Not Achieved'
      };
    });

    setAttainmentResults(mockAttainment);
    showPopup('Attainment calculated successfully!');
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
      {/* Custom Popup */}
      {popupMessage && (
        <Popup message={popupMessage} type={popupType} />
      )}

      <div className="grid md:grid-cols-[2fr_1fr] gap-6 mb-6">
        {/* Input Panel */}
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
          <div className="flex items-center mb-4">
            <BarChart2
              className={`mr-3 ${
                isDarkMode ? "text-green-400" : "text-green-600"
              }`}
            />
            <h2 className="text-xl font-semibold">Course Outcome Attainment</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label 
                className={`block mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Subject
              </label>
              <input 
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`
                  w-full p-3 rounded-lg border
                  ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-900"
                  }
                `}
                placeholder="Enter Subject Name"
              />
            </div>

            <div>
              <label 
                className={`block mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Upload Marks Sheet (Excel)
              </label>
              <div 
                className={`
                  flex items-center justify-center w-full
                  border-2 border-dashed rounded-lg p-6
                  ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700"
                      : "border-gray-300 bg-gray-50"
                  }
                `}
              >
                <input 
                  type="file" 
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="excel-upload"
                />
                <label 
                  htmlFor="excel-upload" 
                  className={`
                    flex items-center cursor-pointer
                    ${
                      isDarkMode
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-blue-600 hover:text-blue-500"
                    }
                  `}
                >
                  <FileUp className="mr-2" />
                  {excelFile ? excelFile.name : "Choose Excel File"}
                </label>
              </div>
            </div>

            <button
              onClick={calculateAttainment}
              disabled={!subject || !excelFile}
              className={`
                w-full p-3 rounded-lg transition-all duration-300
                ${
                  !subject || !excelFile
                    ? "bg-gray-400 cursor-not-allowed"
                    : isDarkMode
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-green-500 hover:bg-green-600"
                }
                text-white font-semibold
              `}
            >
              Calculate Attainment
            </button>
          </div>
        </div>

        {/* Course Outcomes Panel */}
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
          <div className="flex items-center mb-4">
            <BookOpen
              className={`mr-3 ${
                isDarkMode ? "text-indigo-400" : "text-indigo-600"
              }`}
            />
            <h2 className="text-xl font-semibold">Course Outcomes</h2>
          </div>
          {courseOutcomes.map((co) => (
            <div
              key={co.co}
              className={`
                p-4 rounded-lg mb-4 transition-all duration-300
                ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}
              `}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold">
                  {co.co}: {co.description}
                </h3>
                <span 
                  className={`
                    p-1 px-3 rounded-full text-sm
                    ${
                      isDarkMode 
                        ? "bg-gray-600 text-gray-300" 
                        : "bg-gray-200 text-gray-700"
                    }
                  `}
                >
                  Target: {co.target}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attainment Results */}
      {attainmentResults && (
        <div
          className={`
          p-6 rounded-xl shadow-lg
          ${
            isDarkMode
              ? "bg-gray-800 border-l-4 border-purple-600"
              : "bg-white border-l-4 border-purple-500"
          }
        `}
        >
          <div className="flex items-center mb-4">
            <BarChart2
              className={`mr-3 ${
                isDarkMode ? "text-purple-400" : "text-purple-600"
              }`}
            />
            <h2 className="text-xl font-semibold">Attainment Results</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={`
                    ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-700"
                    }
                  `}
                >
                  <th className="p-3 text-left">Course Outcome</th>
                  <th className="p-3 text-center">Target</th>
                  <th className="p-3 text-center">Students Passing</th>
                  <th className="p-3 text-center">Total Students</th>
                  <th className="p-3 text-center">Attainment %</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {attainmentResults.map((result) => (
                  <tr 
                    key={result.co}
                    className={`
                      border-b
                      ${
                        isDarkMode
                          ? "border-gray-700 hover:bg-gray-700"
                          : "border-gray-200 hover:bg-gray-100"
                      }
                    `}
                  >
                    <td className="p-3">{result.co}</td>
                    <td className="p-3 text-center">{result.target}%</td>
                    <td className="p-3 text-center">{result.studentsPassing}</td>
                    <td className="p-3 text-center">{result.totalStudents}</td>
                    <td className="p-3 text-center">{result.attainmentPercentage}%</td>
                    <td 
                      className={`
                        p-3 text-center font-semibold
                        ${
                          result.status === 'Achieved'
                            ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                            : (isDarkMode ? 'text-red-400' : 'text-red-600')
                        }
                      `}
                    >
                      {result.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttainmentAnalysis;