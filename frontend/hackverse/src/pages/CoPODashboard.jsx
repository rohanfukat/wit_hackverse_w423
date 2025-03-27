import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../App';
import { 
  PlusCircle, 
  Download, 
  Edit, 
  BookOpen, 
  Navigation, 
  X, 
  Check, 
  AlertCircle, 
  Info,
  Layers,
  Target,
  Award,
  Star
} from 'lucide-react';

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

  // State for modals and tooltips
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Improved color palettes with better text visibility
  const colorPalettes = {
    light: {
      background: 'bg-gradient-to-br from-gray-50 to-gray-100',
      cardBg: 'bg-white shadow-md hover:shadow-xl transition-shadow',
      primaryAccent: 'bg-blue-500 text-white hover:bg-blue-600',
      secondaryAccent: 'bg-green-500 text-white hover:bg-green-600',
      tertiaryAccent: 'bg-purple-500 text-white hover:bg-purple-600',
      
      // Text colors for different sections
      headerText: 'text-gray-900',
      subHeaderText: 'text-gray-700',
      primaryText: 'text-gray-800',
      secondaryText: 'text-gray-600',
      accentText: {
        blue: 'text-blue-800',
        green: 'text-green-800',
        purple: 'text-purple-800',
        indigo: 'text-indigo-800'
      },
      inputText: 'text-gray-900',
      inputPlaceholder: 'text-gray-500'
    },
    dark: {
      background: 'bg-gradient-to-br from-gray-900 to-gray-800',
      cardBg: 'bg-gray-800 border border-gray-700 hover:border-gray-600',
      primaryAccent: 'bg-blue-700 text-white hover:bg-blue-800',
      secondaryAccent: 'bg-green-700 text-white hover:bg-green-800',
      tertiaryAccent: 'bg-purple-700 text-white hover:bg-purple-800',
      
      // Text colors for different sections
      headerText: 'text-gray-100',
      subHeaderText: 'text-gray-300',
      primaryText: 'text-gray-100',
      secondaryText: 'text-gray-400',
      accentText: {
        blue: 'text-blue-300',
        green: 'text-green-300',
        purple: 'text-purple-300',
        indigo: 'text-indigo-300'
      },
      inputText: 'text-gray-100',
      inputPlaceholder: 'text-gray-500'
    }
  };

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
    // Validation
    if (!CO_name || !CO_ID || !sem || !subject) {
      setErrorMessage('Please fill in all course details');
      setShowErrorModal(true);
      return;
    }
  
    if (CO_number.some(co => !co.description.trim())) {
      setErrorMessage('Please fill in descriptions for all Course Outcomes');
      setShowErrorModal(true);
      return;
    }
  
    const CO_data = CO_number.map(co => co.description.trim());
  
    const data = {
      CO_name,
      CO_ID,
      sem,
      subject,
      CO_data
    };
  
    try {
      const response = await fetch('http://127.0.0.1:8000/course_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setIsSubmitted(true);
          setShowSuccessModal(false);
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrorMessage('Error submitting data');
        setShowErrorModal(true);
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setErrorMessage('Network error. Please try again.');
      setShowErrorModal(true);
    }
  };
  
  // Handle changes to PO mapping
  const handleMakeChanges = () => {
    if (!changesCO || !changesPO || !changesBloomsTaxonomy || !changesJustification || !changesRank) {
      setErrorMessage('Please fill in all change fields');
      setShowErrorModal(true);
      return;
    }

    const existingMappingIndex = poMapping.findIndex(
      mapping => mapping.co === changesCO && mapping.po === changesPO
    );

    if (existingMappingIndex !== -1) {
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

    // Show success feedback
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 2000);
  };

  // Export to PDF (placeholder function)
  const exportToPDF = () => {
    setShowInfoModal(true);
  };

  // Decorative Header Component
  const DashboardHeader = () => (
    <div className={`
      flex items-center justify-between p-4 mb-4 
      ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
      rounded-xl shadow-md
    `}>
      <div className="flex items-center space-x-4">
        <Layers className={`w-10 h-10 ${isDarkMode ? colorPalettes.dark.accentText.blue : colorPalettes.light.accentText.blue}`} />
        <div>
          <h1 className={`text-2xl font-bold ${isDarkMode ? colorPalettes.dark.headerText : colorPalettes.light.headerText}`}>
            Course Outcome & PO Mapping
          </h1>
          <p className={`text-sm ${isDarkMode ? colorPalettes.dark.subHeaderText : colorPalettes.light.subHeaderText}`}>
            Comprehensive Course Mapping Dashboard
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Target className={`w-6 h-6 ${isDarkMode ? colorPalettes.dark.accentText.green : colorPalettes.light.accentText.green}`} />
        <Award className={`w-6 h-6 ${isDarkMode ? colorPalettes.dark.accentText.purple : colorPalettes.light.accentText.purple}`} />
        <Star className={`w-6 h-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
      </div>
    </div>
  );

  // Progress Indicator
  const ProgressIndicator = ({ step }) => (
    <div className="flex justify-center space-x-4 mb-6">
      {['Course Details', 'Course Outcomes', 'PO Mapping'].map((title, index) => (
        <div 
          key={title} 
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-full
            ${index <= step 
              ? (isDarkMode 
                  ? 'bg-blue-900 text-blue-300' 
                  : 'bg-blue-100 text-blue-800')
              : (isDarkMode 
                  ? 'bg-gray-800 text-gray-500' 
                  : 'bg-gray-100 text-gray-500')
            }
          `}
        >
          <span>{title}</span>
          {index < step && <Check className="w-4 h-4" />}
        </div>
      ))}
    </div>
  );

  // Background Decorative Elements
  const BackgroundPattern = () => (
    <div 
      className={`
        absolute inset-0 z-[-1] opacity-10 
        ${isDarkMode 
          ? 'bg-gradient-to-br from-blue-900 to-purple-900' 
          : 'bg-gradient-to-br from-blue-100 to-purple-100'
        }
      `}
      style={{
        backgroundImage: `
          radial-gradient(${isDarkMode ? 'rgba(55,65,81,0.2)' : 'rgba(199,210,254,0.2)'} 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}
    />
  );

  // Modal Components
  const renderInfoModal = () => (
    showInfoModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div 
          className={`
            p-6 rounded-xl shadow-2xl max-w-md w-full
            ${isDarkMode ? "bg-gray-800" : "bg-white"}
          `}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl font-semibold ${isDarkMode ? colorPalettes.dark.headerText : colorPalettes.light.headerText}`}>
              Export Information
            </h2>
            <button 
              onClick={() => setShowInfoModal(false)}
              className={`
                p-2 rounded-full hover:bg-opacity-10
                ${isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className={`${isDarkMode ? colorPalettes.dark.primaryText : colorPalettes.light.primaryText}`}>
            PDF export functionality will be available soon.
          </p>
        </div>
      </div>
    )
  );

  const renderSuccessModal = () => (
    showSuccessModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div 
          className={`
            p-6 rounded-xl shadow-2xl max-w-md w-full text-center
            ${isDarkMode ? "bg-gray-800" : "bg-white"}
          `}
        >
          <div className="flex justify-center mb-4">
            <Check 
              className={`
                w-16 h-16 
                ${isDarkMode 
                  ? 'text-green-400' 
                  : 'text-green-600'
                }
              `} 
            />
          </div>
          <h2 className={`
            text-xl font-semibold mb-2
            ${isDarkMode 
              ? colorPalettes.dark.headerText 
              : colorPalettes.light.headerText
            }
          `}>
            Success
          </h2>
          <p className={`
            ${isDarkMode 
              ? colorPalettes.dark.primaryText 
              : colorPalettes.light.primaryText
            }
          `}>
            Operation completed successfully!
          </p>
        </div>
      </div>
    )
  );

  const renderErrorModal = () => (
    showErrorModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div 
          className={`
            p-6 rounded-xl shadow-2xl max-w-md w-full
            ${isDarkMode ? "bg-gray-800" : "bg-white"}
          `}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <AlertCircle 
                className={`
                  w-8 h-8 mr-3 
                  ${isDarkMode 
                    ? 'text-red-400' 
                    : 'text-red-600'
                  }
                `} 
              />
              <h2 className={`
                text-xl font-semibold 
                ${isDarkMode 
                  ? colorPalettes.dark.headerText 
                  : colorPalettes.light.headerText
                }
              `}>
                Error
              </h2>
            </div>
            <button 
              onClick={() => setShowErrorModal(false)}
              className={`
                p-2 rounded-full hover:bg-opacity-10
                ${isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className={`
            ${isDarkMode 
              ? colorPalettes.dark.primaryText 
              : colorPalettes.light.primaryText
            }
          `}>
            {errorMessage}
          </p>
        </div>
      </div>
    )
  );

  return (
    <div 
      className={`
        relative min-h-screen p-4 overflow-hidden
        ${isDarkMode 
          ? colorPalettes.dark.background 
          : colorPalettes.light.background
        }
      `}
    >
      {/* Decorative Background */}
      <BackgroundPattern />

      {/* Modal Renderings */}
      {renderInfoModal()}
      {renderSuccessModal()}
      {renderErrorModal()}

      {/* Dashboard Header */}
      <DashboardHeader />

      {/* Progress Indicator */}
      <ProgressIndicator 
        step={isSubmitted ? 2 : (CO_number.length > 0 ? 1 : 0)} 
      />

      <div 
        className={`
          rounded-xl p-6 
          ${isDarkMode 
            ? colorPalettes.dark.cardBg 
            : colorPalettes.light.cardBg
          }
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
                <h2 className={`mr-3 text-xl font-semibold ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }` }>Course Details</h2>
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
                    label: "Semester", 
                    value: sem, 
                    setter: setsem 
                  },
                  { 
                    label: "Subject", 
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
                <h2 className={`mr-3 text-xl font-semibold ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }` }>Course Outcomes (CO_number)</h2>
                 
                
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
              <h2 className={`mr-3 text-xl font-semibold ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }` }>PO Mapping</h2>
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
                
                {/* Other input fields for changes remain the same */}
                
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
    </div>
  );
};

export default CoPODashboard;