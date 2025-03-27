import React, { useState, useContext } from 'react';
import { ThemeContext } from '../App';
import { PlusCircle, Download, Edit, BookOpen, Navigation } from 'lucide-react';

const CoPODashboard = ({ className }) => {
  const { isDarkMode } = useContext(ThemeContext);
  
  // State for course details
  const [CO_name, setCO_name] = useState('');
  const [CO_ID, setCO_ID] = useState('');
  const [sem, setsem] = useState('');
  const [subject, setsubject] = useState('');
  
  // State for CO_number
  const [CO_number, setCO_number] = useState([{ id: 1, description: '' }]);
  
  // State for tracking workflow stages
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Dynamic PO Mapping State
  const [poMapping, setPoMapping] = useState([
    {
      co: 'CO1',
      po: 'PO1',
      bloomsTaxonomy: 'Remember',
      justification: 'Basic understanding of core concepts',
      rank: 3
    },
    {
      co: 'CO2',
      po: 'PO2',
      bloomsTaxonomy: 'Understand',
      justification: 'Comprehension of advanced principles',
      rank: 2
    },
    {
      co: 'CO3',
      po: 'PO3',
      bloomsTaxonomy: 'Apply',
      justification: 'Practical application of learned skills',
      rank: 1
    }
  ]);
  
  // State for making changes
  const [changesCO, setChangesCO] = useState('');
  const [changesPO, setChangesPO] = useState('');
  const [changesBloomsTaxonomy, setChangesBloomsTaxonomy] = useState('');
  const [changesJustification, setChangesJustification] = useState('');
  const [changesRank, setChangesRank] = useState('');

  // Add new CO
  const addCO = () => {
    const newCOId = CO_number.length + 1;
    setCO_number([...CO_number, { id: newCOId, description: '' }]);
  };

  // Update CO description
  const updateCODescription = (id, description) => {
    const updatedCO_number = CO_number.map(co => 
      co.id === id ? { ...co, description } : co
    );
    setCO_number(updatedCO_number);
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!CO_name || !CO_ID || !sem || !subject) {
      alert('Please fill in all course details');
      return;
    }
  
    // Validate CO_number
    if (CO_number.some(co => !co.description.trim())) {
      alert('Please fill in descriptions for all CO_number');
      return;
    }
  
    // Prepare the data to send to the backend
    const CO_data = CO_number.map(co => co.description.trim()); // Strip extra spaces
  
    const data = {
      CO_name,
      CO_ID,
      sem,
      subject,
      CO_data
    };
  
    console.log("Sending data:", data); // Log the data for debugging
  
    try {
      const response = await fetch('http://127.0.0.1:8000/course_data', {
        method: 'POST', // HTTP method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        alert('Data submitted successfully!');
        setIsSubmitted(true);
      } else {
        alert('Error submitting data');
        const errorData = await response.json();
        console.error('Error details:', errorData); // Log error details for debugging
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Error submitting data');
    }
  };
  
  
  // Handle changes to PO mapping
  const handleMakeChanges = () => {
    // Validation to ensure all fields are filled
    if (!changesCO || !changesPO || !changesBloomsTaxonomy || !changesJustification || !changesRank) {
      alert('Please fill in all change fields');
      return;
    }

    // Check if the CO-PO combination already exists
    const existingMappingIndex = poMapping.findIndex(
      mapping => mapping.co === changesCO && mapping.po === changesPO
    );

    if (existingMappingIndex !== -1) {
      // Update existing mapping
      const updatedMapping = [...poMapping];
      updatedMapping[existingMappingIndex] = {
        co: changesCO,
        po: changesPO,
        bloomsTaxonomy: changesBloomsTaxonomy,
        justification: changesJustification,
        rank: parseInt(changesRank)
      };
      setPoMapping(updatedMapping);
    } else {
      // Add new mapping
      setPoMapping([
        ...poMapping, 
        {
          co: changesCO,
          po: changesPO,
          bloomsTaxonomy: changesBloomsTaxonomy,
          justification: changesJustification,
          rank: parseInt(changesRank)
        }
      ]);
    }

    // Reset change fields
    setChangesCO('');
    setChangesPO('');
    setChangesBloomsTaxonomy('');
    setChangesJustification('');
    setChangesRank('');
  };

  // Export to PDF (placeholder function)
  const exportToPDF = () => {
    alert('PDF export is not supported in this version.');
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
          {/* Course Details Panel - Full Width */}
          <div
            className={`
              p-6 rounded-xl shadow-lg mb-6
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
            
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { 
                  label: "Course Name", 
                  value: CO_name, 
                  setter: setCO_name 
                },
                { 
                  label: "Course ID", 
                  value: CO_ID, 
                  setter: setCO_ID 
                },
                { 
                  label: "sem", 
                  value: sem, 
                  setter: setsem 
                },
                { 
                  label: "subject", 
                  value: subject, 
                  setter: setsubject 
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

          {/* Course Outcomes Panel - Below Course Details */}
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
              <h2 className="text-xl font-semibold">Course Outcomes (CO_number)</h2>
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
              {CO_number.map((co) => (
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
      {isSubmitted && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Final PO Mapping Panel */}
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
              <h2 className="text-xl font-semibold">PO Mapping</h2>
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
              className={`
                rounded-lg overflow-hidden
                ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}
              `}
            >
              <div className={`grid grid-cols-5 font-bold p-3 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}>
                <div>CO</div>
                <div>PO</div>
                <div>Bloom's Taxonomy</div>
                <div>Justification</div>
                <div>Rank</div>
              </div>
              {poMapping.map((mapping, index) => (
                <div 
                  key={index} 
                  className={`
                    grid grid-cols-5 p-3 border-t
                    ${isDarkMode ? "border-gray-600" : "border-gray-200"}
                  `}
                >
                  <div>{mapping.co}</div>
                  <div>{mapping.po}</div>
                  <div>{mapping.bloomsTaxonomy}</div>
                  <div>{mapping.justification}</div>
                  <div>{mapping.rank}</div>
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
                <label className="block mb-2">Bloom's Taxonomy</label>
                <input
                  type="text"
                  placeholder="Enter Bloom's Taxonomy Level"
                  value={changesBloomsTaxonomy}
                  onChange={(e) => setChangesBloomsTaxonomy(e.target.value)}
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
                <label className="block mb-2">Justification</label>
                <input
                  type="text"
                  placeholder="Enter Justification"
                  value={changesJustification}
                  onChange={(e) => setChangesJustification(e.target.value)}
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