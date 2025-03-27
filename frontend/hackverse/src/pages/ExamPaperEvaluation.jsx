import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../App";
import { FileUp, FileText, BookOpen, Search, Save, X, CheckCircle } from "lucide-react";

const ExamPaperEvaluation = ({ className }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [subject, setSubject] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [evaluationResults, setEvaluationResults] = useState(null);
  
  // New states for database features
  const [searchSubject, setSearchSubject] = useState("");
  const [existingReport, setExistingReport] = useState(null);
  const [isSavingReport, setIsSavingReport] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // New state for popup
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState('success');

  // Show popup with message and type
  const showPopup = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);

    // Automatically clear popup after 3 seconds
    setTimeout(() => {
      setPopupMessage(null);
    }, 3000);
  };

  // Custom Popup Component
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

  // Static Course Outcomes (CO) for demonstration
  const courseOutcomes = Array.from({ length: 5 }, (_, i) => ({
    co: `CO${i + 1}`,
    description: `Course Outcome ${i + 1} Description`
  }));

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setExcelFile(file);
  };

  const generateEvaluation = () => {
    // Placeholder for actual backend evaluation
    const mockResults = Array.from({ length: 10 }, (_, i) => ({
      name: `Student ${i + 1}`,
      ...Object.fromEntries(
        courseOutcomes.map(co => [co.co, Math.floor(Math.random() * 100)])
      )
    }));

    setEvaluationResults(mockResults);
  };

  // Improved save to database function
  const saveToDatabase = async () => {
    // Reset previous errors
    setSaveError(null);

    // Validate before saving
    if (!subject) {
      showPopup('Please enter a subject before saving', 'error');
      return;
    }

    if (!evaluationResults) {
      showPopup('No evaluation results to save', 'error');
      return;
    }

    // Set saving state
    setIsSavingReport(true);

    try {
      // Simulate API call (replace with actual API call)
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulating a possible error scenario
          if (Math.random() < 0.1) {  // 10% chance of error for demonstration
            reject(new Error('Database connection failed'));
          } else {
            resolve({
              success: true,
              message: 'Report saved successfully',
              savedData: {
                subject,
                totalStudents: evaluationResults.length
              }
            });
          }
        }, 1500);  // Simulate network delay
      });

      // Success scenario
      showPopup(response.message);
      
      // Optional: you might want to do something with the response
      console.log('Save response:', response);
    } catch (error) {
      // Error handling
      const errorMessage = error.message || 'Failed to save report';
      showPopup(errorMessage, 'error');
      setSaveError(errorMessage);
    } finally {
      // Always reset saving state
      setIsSavingReport(false);
    }
  };

  const searchExistingReport = () => {
    // Placeholder for database search functionality
    if (searchSubject) {
      // Simulating an existing report fetch
      const mockExistingReport = {
        subject: searchSubject,
        results: Array.from({ length: 10 }, (_, i) => ({
          name: `Student ${i + 1}`,
          ...Object.fromEntries(
            courseOutcomes.map(co => [co.co, Math.floor(Math.random() * 100)])
          )
        }))
      };
      setExistingReport(mockExistingReport);
      
      // Show popup for successful search
      showPopup(`Existing report found for ${searchSubject}`);
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
      {/* Custom Popup */}
      {popupMessage && (
        <Popup message={popupMessage} type={popupType} />
      )}

      {/* Error notification */}
      {saveError && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{saveError}</span>
        </div>
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
            <BookOpen
              className={`mr-3 ${
                isDarkMode ? "text-green-400" : "text-green-600"
              }`}
            />
            <h2 className="text-xl font-semibold">Exam Paper Evaluation</h2>
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
                Upload Excel
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
              onClick={generateEvaluation}
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
              Generate Evaluation
            </button>

            {evaluationResults && (
              <button
                onClick={saveToDatabase}
                disabled={isSavingReport}
                className={`
                  w-full p-3 rounded-lg transition-all duration-300 mt-4
                  ${
                    isSavingReport
                      ? "bg-gray-400 cursor-not-allowed"
                      : isDarkMode
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  }
                  text-white font-semibold flex items-center justify-center
                `}
              >
                <Save className="mr-2" />
                {isSavingReport ? 'Saving...' : 'Save to Database'}
              </button>
            )}
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
            <FileText
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
              <h3 className="font-bold mb-2">
                {co.co}: {co.description}
              </h3>
            </div>
          ))}

          {/* Search Existing Report Section */}
          <div className="mt-6">
            <div className="flex items-center mb-4">
              <Search
                className={`mr-3 ${
                  isDarkMode ? "text-purple-400" : "text-purple-600"
                }`}
              />
              <h2 className="text-xl font-semibold">Search Existing Report</h2>
            </div>
            
            <div className="flex space-x-2">
              <input 
                type="text"
                value={searchSubject}
                onChange={(e) => setSearchSubject(e.target.value)}
                className={`
                  flex-grow p-3 rounded-lg border
                  ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-900"
                  }
                `}
                placeholder="Enter Subject Name"
              />
              <button
                onClick={searchExistingReport}
                disabled={!searchSubject}
                className={`
                  p-3 rounded-lg transition-all duration-300
                  ${
                    !searchSubject
                      ? "bg-gray-400 cursor-not-allowed"
                      : isDarkMode
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-purple-500 hover:bg-purple-600"
                  }
                  text-white font-semibold
                `}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Results */}
      {(evaluationResults || existingReport) && (
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
            <FileText
              className={`mr-3 ${
                isDarkMode ? "text-purple-400" : "text-purple-600"
              }`}
            />
            <h2 className="text-xl font-semibold">
              {existingReport ? 'Existing Report' : 'Evaluation Results'}
            </h2>
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
                  <th className="p-3 text-left">Name</th>
                  {courseOutcomes.map(co => (
                    <th key={co.co} className="p-3 text-center">{co.co}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(existingReport?.results || evaluationResults).map((result, index) => (
                  <tr 
                    key={index}
                    className={`
                      border-b
                      ${
                        isDarkMode
                          ? "border-gray-700 hover:bg-gray-700"
                          : "border-gray-200 hover:bg-gray-100"
                      }
                    `}
                  >
                    <td className="p-3">{result.name}</td>
                    {courseOutcomes.map(co => (
                      <td 
                        key={co.co} 
                        className="p-3 text-center"
                      >
                        {result[co.co]}
                      </td>
                    ))}
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

export default ExamPaperEvaluation;