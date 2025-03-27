import React, { useState, useContext } from 'react';
import { ThemeContext } from '../App';
import { PlusCircle, Download, Edit, BookOpen, Navigation } from 'lucide-react';
import * as html2pdf from 'html2pdf.js';

const CoPODashboard = ({ className }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  // State for course details
  const [courseName, setCourseName] = useState('');
  const [courseId, setCourseId] = useState('');
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  
  // State for COs
  const [cos, setCos] = useState([{ id: 1, description: '' }]);
  
  // State for tracking workflow stages
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPOMappingComplete, setIsPOMappingComplete] = useState(false);
  
  // State for PO Mapping
  const [poMapping, setPoMapping] = useState([]);
  
  // State for making changes
  const [changesCO, setChangesCO] = useState('');
  const [changesPO, setChangesPO] = useState('');
  const [changesRank, setChangesRank] = useState('');

  // Add new CO
  const addCO = () => {
    const newCOId = cos.length + 1;
    setCos([...cos, { id: newCOId, description: '' }]);
  };

  // Update CO description
  const updateCODescription = (id, description) => {
    const updatedCos = cos.map(co => 
      co.id === id ? { ...co, description } : co
    );
    setCos(updatedCos);
  };

  // Handle submission
  const handleSubmit = () => {
    // Basic validation
    if (!courseName || !courseId || !semester || !subject) {
      alert('Please fill in all course details');
      return;
    }

    // Validate COs
    if (cos.some(co => !co.description.trim())) {
      alert('Please fill in descriptions for all COs');
      return;
    }

    // Generate initial PO mapping
    const initialMapping = cos.map(co => ({
      co: `CO${co.id}`,
      po: '',
      justification: ''
    }));

    setPoMapping(initialMapping);
    setIsSubmitted(true);
  };

  // Update PO mapping
  const updatePOMapping = (index, field, value) => {
    const updatedMapping = [...poMapping];
    updatedMapping[index][field] = value;
    setPoMapping(updatedMapping);
  };

  // Handle PO Mapping completion
  const handlePOMappingComplete = () => {
    // Validate that all POs are mapped
    if (poMapping.some(mapping => !mapping.po || !mapping.justification.trim())) {
      alert('Please map all Course Outcomes and provide justifications');
      return;
    }

    setIsPOMappingComplete(true);
  };

  // Handle changes
  const handleMakeChanges = () => {
    if (!changesCO || !changesPO || !changesRank) {
      alert('Please fill in all change fields');
      return;
    }

    const updatedMapping = poMapping.map(mapping => 
      mapping.co === changesCO 
        ? { ...mapping, po: changesPO, justification: `Rank: ${changesRank}` }
        : mapping
    );

    setPoMapping(updatedMapping);
    
    // Reset change fields
    setChangesCO('');
    setChangesPO('');
    setChangesRank('');
  };

  // Export to PDF
  const exportToPDF = () => {
    const element = document.getElementById('po-mapping-table');
    const opt = {
      margin:       1,
      filename:     'po-mapping.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
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
      {/* Course Details and Course Outcomes Section */}
      {!isSubmitted && (
        <>
          <div className="grid md:grid-cols-[2fr_1fr] gap-6 mb-6">
            {/* Course Details Panel */}
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
                <Navigation
                  className={`mr-3 ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`}
                />
                <h2 className="text-xl font-semibold">Course Details</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { 
                    label: "Course Name", 
                    value: courseName, 
                    setter: setCourseName 
                  },
                  { 
                    label: "Course ID", 
                    value: courseId, 
                    setter: setCourseId 
                  },
                  { 
                    label: "Semester", 
                    value: semester, 
                    setter: setSemester 
                  },
                  { 
                    label: "Subject", 
                    value: subject, 
                    setter: setSubject 
                  }
                ].map(({ label, value, setter }) => (
                  <input
                    key={label}
                    type="text"
                    placeholder={label}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className={`
                      p-3 rounded-lg border
                      ${
                        isDarkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100"
                          : "bg-white border-gray-300 text-gray-900"
                      }
                      focus:outline-none focus:ring-2 
                      ${
                        isDarkMode
                          ? "focus:ring-green-500"
                          : "focus:ring-green-400"
                      }
                    `}
                  />
                ))}
              </div>
            </div>

            {/* Course Outcomes Panel */}
            <div
              className={`
                p-6 rounded-xl shadow-lg
                ${
                  isDarkMode
                    ? "bg-gray-800 border-l-4 border-blue-600"
                    : "bg-white border-l-4 border-blue-500"
                }
              `}
            >
              <div className="flex items-center mb-4">
                <BookOpen
                  className={`mr-3 ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <h2 className="text-xl font-semibold">Course Outcomes (COs)</h2>
                <button 
                  onClick={addCO}
                  className={`
                    ml-auto flex items-center px-3 py-2 rounded-full
                    ${
                      isDarkMode
                        ? "bg-blue-900 text-blue-300 hover:bg-blue-800"
                        : "bg-blue-200 text-blue-800 hover:bg-blue-300"
                    }
                  `}
                >
                  <PlusCircle className="mr-2" size={18} /> Add CO
                </button>
              </div>
              
              <div className="space-y-4">
                {cos.map((co) => (
                  <div
                    key={co.id}
                    className={`
                      p-4 rounded-lg transition-all duration-300
                      ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}
                    `}
                  >
                    <textarea
                      placeholder={`Enter CO${co.id} Description`}
                      value={co.description}
                      onChange={(e) => updateCODescription(co.id, e.target.value)}
                      className={`
                        w-full p-3 rounded-lg border min-h-[100px]
                        ${
                          isDarkMode
                            ? "bg-gray-600 border-gray-500 text-gray-100"
                            : "bg-white border-gray-300 text-gray-900"
                        }
                        focus:outline-none focus:ring-2
                        ${
                          isDarkMode
                            ? "focus:ring-blue-500"
                            : "focus:ring-blue-400"
                        }
                      `}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button 
              onClick={handleSubmit}
              className={`
                px-6 py-3 rounded-lg text-lg font-semibold
                ${
                  isDarkMode
                    ? "bg-blue-900 text-blue-300 hover:bg-blue-800"
                    : "bg-blue-200 text-blue-800 hover:bg-blue-300"
                }
              `}
            >
              Submit and Proceed to PO Mapping
            </button>
          </div>
        </>
      )}

      {/* PO Mapping Section */}
      {isSubmitted && !isPOMappingComplete && (
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
            <Edit
              className={`mr-3 ${
                isDarkMode ? "text-purple-400" : "text-purple-600"
              }`}
            />
            <h2 className="text-xl font-semibold">Program Outcome (PO) Mapping</h2>
          </div>

          <div className="space-y-4">
            {poMapping.map((mapping, index) => (
              <div 
                key={mapping.co}
                className={`
                  p-4 rounded-lg flex space-x-4
                  ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}
                `}
              >
                <div className="flex-grow">
                  <label className="block mb-2">{mapping.co}</label>
                  <input
                    type="text"
                    placeholder="Enter PO (e.g., PO1, PO2)"
                    value={mapping.po}
                    onChange={(e) => updatePOMapping(index, 'po', e.target.value)}
                    className={`
                      w-full p-3 rounded-lg border
                      ${
                        isDarkMode
                          ? "bg-gray-600 border-gray-500 text-gray-100"
                          : "bg-white border-gray-300 text-gray-900"
                      }
                    `}
                  />
                </div>
                <div className="flex-grow">
                  <label className="block mb-2">Justification</label>
                  <input
                    type="text"
                    placeholder="Enter Justification"
                    value={mapping.justification}
                    onChange={(e) => updatePOMapping(index, 'justification', e.target.value)}
                    className={`
                      w-full p-3 rounded-lg border
                      ${
                        isDarkMode
                          ? "bg-gray-600 border-gray-500 text-gray-100"
                          : "bg-white border-gray-300 text-gray-900"
                      }
                    `}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <button 
              onClick={handlePOMappingComplete}
              className={`
                px-6 py-3 rounded-lg text-lg font-semibold
                ${
                  isDarkMode
                    ? "bg-green-900 text-green-300 hover:bg-green-800"
                    : "bg-green-200 text-green-800 hover:bg-green-300"
                }
              `}
            >
              Complete PO Mapping
            </button>
          </div>
        </div>
      )}

      {/* Make Changes Section */}
      {isPOMappingComplete && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* PO Mapping Display Panel */}
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Final PO Mapping</h2>
              <button 
                onClick={exportToPDF}
                className={`
                  flex items-center px-4 py-2 rounded-lg
                  ${
                    isDarkMode
                      ? "bg-green-900 text-green-300 hover:bg-green-800"
                      : "bg-green-200 text-green-800 hover:bg-green-300"
                  }
                `}
              >
                <Download className="mr-2" size={18} /> Export PDF
              </button>
            </div>
            
            <div 
              id="po-mapping-table"
              className={`
                rounded-lg overflow-hidden
                ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}
              `}
            >
              <div className={`grid grid-cols-3 font-bold p-3 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}>
                <div>CO</div>
                <div>PO</div>
                <div>Justification</div>
              </div>
              {poMapping.map((mapping, index) => (
                <div 
                  key={index} 
                  className={`
                    grid grid-cols-3 p-3 border-t
                    ${isDarkMode ? "border-gray-600" : "border-gray-200"}
                  `}
                >
                  <div>{mapping.co}</div>
                  <div>{mapping.po}</div>
                  <div>{mapping.justification}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Make Changes Panel */}
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
            <h2 className="text-xl font-semibold mb-4">Make Changes</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2">CO</label>
                <input
                  type="text"
                  placeholder="Enter CO"
                  value={changesCO}
                  onChange={(e) => setChangesCO(e.target.value)}
                  className={`
                    w-full p-3 rounded-lg border
                    ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                    focus:outline-none focus:ring-2
                    ${
                      isDarkMode
                        ? "focus:ring-indigo-500"
                        : "focus:ring-indigo-400"
                    }
                  `}
                />
              </div>
              
              <div>
                <label className="block mb-2">PO</label>
                <input
                  type="text"
                  placeholder="Enter PO"
                  value={changesPO}
                  onChange={(e) => setChangesPO(e.target.value)}
                  className={`
                    w-full p-3 rounded-lg border
                    ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                    focus:outline-none focus:ring-2
                    ${
                      isDarkMode
                        ? "focus:ring-indigo-500"
                        : "focus:ring-indigo-400"
                    }
                  `}
                />
              </div>
              
              <div>
                <label className="block mb-2">Rank</label>
                <input
                  type="text"
                  placeholder="Enter Rank"
                  value={changesRank}
                  onChange={(e) => setChangesRank(e.target.value)}
                  className={`
                    w-full p-3 rounded-lg border
                    ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                    focus:outline-none focus:ring-2
                    ${
                      isDarkMode
                        ? "focus:ring-indigo-500"
                        : "focus:ring-indigo-400"
                    }
                  `}
                />
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <button 
                  onClick={handleMakeChanges}
                  className={`
                    w-full px-4 py-3 rounded-lg
                    ${
                      isDarkMode
                        ? "bg-indigo-900 text-indigo-300 hover:bg-indigo-800"
                        : "bg-indigo-200 text-indigo-800 hover:bg-indigo-300"
                    }
                  `}
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoPODashboard;