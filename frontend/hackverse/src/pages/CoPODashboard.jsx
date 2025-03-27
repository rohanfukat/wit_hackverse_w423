import React, { useState, useContext } from 'react';
import { ThemeContext } from '../App';
import { 
  PlusCircle, 
  Download, 
  BookOpen, 
  Navigation, 
  X, 
  Check, 
  AlertCircle, 
  Info,
  Layers,
  Target,
  Award,
  Star,
  Frown,
  FileText
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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
  
  // PO Mapping State
  const [poMapping, setPoMapping] = useState([]);
  
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
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Bloom's Taxonomy options
  const bloomsLevels = [
    'Remembering',
    'Understanding',
    'Applying',
    'Analyzing',
    'Evaluating',
    'Creating'
  ];

  // PO options (assuming PO1-PO12)
  const poOptions = Array.from({ length: 12 }, (_, i) => `PO${i + 1}`);

  // Color palettes
  const colorPalettes = {
    light: {
      background: 'bg-gradient-to-br from-gray-50 to-gray-100',
      cardBg: 'bg-white shadow-md hover:shadow-xl transition-shadow',
      primaryAccent: 'bg-blue-500 text-white hover:bg-blue-600',
      secondaryAccent: 'bg-green-500 text-white hover:bg-green-600',
      headerText: 'text-gray-900',
      subHeaderText: 'text-gray-700',
      primaryText: 'text-gray-800',
      secondaryText: 'text-gray-600',
    },
    dark: {
      background: 'bg-gradient-to-br from-gray-900 to-gray-800',
      cardBg: 'bg-gray-800 border border-gray-700 hover:border-gray-600',
      primaryAccent: 'bg-blue-700 text-white hover:bg-blue-800',
      secondaryAccent: 'bg-green-700 text-white hover:bg-green-800',
      headerText: 'text-gray-100',
      subHeaderText: 'text-gray-300',
      primaryText: 'text-gray-100',
      secondaryText: 'text-gray-400',
    }
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Add new CO
  const addCO = () => {
    const newCOId = CO_number.length + 1;
    setCO_number([...CO_number, { id: newCOId, description: '' }]);
    showNotification(`CO${newCOId} added successfully`);
  };

  // Update CO description
  const updateCODescription = (id, description) => {
    const updatedCO_number = CO_number.map(co => 
      co.id === id ? { ...co, description } : co
    );
    setCO_number(updatedCO_number);
  };

  // Delete a CO
  const deleteCO = (id) => {
    if (CO_number.length <= 1) {
      showNotification('You must have at least one CO', 'error');
      return;
    }
    
    const updatedCO_number = CO_number.filter(co => co.id !== id);
    setCO_number(updatedCO_number);
    showNotification(`CO${id} deleted successfully`);
  };

  const handleSubmit = async () => {
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
  
    try {
      // First, save the course details
      const courseDetailsResponse = await fetch('http://127.0.0.1:8000/save-course-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CO_name,
          CO_ID,
          sem,
          subject,
          CO_number: CO_number.map(co => ({
            id: co.id,
            description: co.description.trim()
          }))
        }),
      });
  
      if (!courseDetailsResponse.ok) {
        const error = await courseDetailsResponse.json();
        throw new Error(error.detail || 'Failed to save course details');
      }
  
      // Show success notification for course details
      showNotification('Course details saved successfully!');
  
      // Then proceed with the PO mapping generation
      const CO_data = CO_number.map(co => co.description.trim());
      const response = await fetch('http://127.0.0.1:8000/course_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          CO_name,
          CO_ID,
          sem,
          subject,
          CO_data
        }),
      });
      
      const responseData = await response.json();
      if (response.ok) {
        const transformedData = responseData.map(item => ({
          CO_number: item.CO_number.replace("CO",""),
          CO_Objective: item.CO_Objective,
          Bloom_Level: item.Bloom_Level,
          Mapped_POs: item.Mapped_POs.map(po => ({
            PO: po.PO,
            Justification: po.Justification,
            Rank: po.Rank
          }))
        }));
        
        setPoMapping(transformedData);
        showNotification('PO mappings generated successfully!');
        setIsSubmitted(true);
      } else {
        throw new Error(responseData.error || 'Error generating PO mappings');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Network error. Please try again.');
      setShowErrorModal(true);
    }
  };

  // Add this function to handle the submission
  const handleSubmitMapping = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare the data for submission
      const mappingData = poMapping.map(co => ({
        subject: subject,
        CO_number: co.CO_number,
        CO_Objective: co.CO_Objective,
        Bloom_Level: co.Bloom_Level,
        Mapped_POs: co.Mapped_POs.map(po => ({
          PO: po.PO,
          Rank: po.Rank,
          Justification: po.Justification || ''
        }))
      }));

      const response = await fetch('http://127.0.0.1:8000/save_co-po_mapping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mappingData)
      });

      if (!response.ok) {
        throw new Error('Failed to save mapping');
      }

      showNotification('CO-PO Mapping saved successfully!');
    } catch (error) {
      console.error('Error saving mapping:', error);
      showNotification('Failed to save mapping: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMakeChanges = () => {
    if (!changesCO || !changesPO || !changesBloomsTaxonomy || !changesJustification || !changesRank) {
      setErrorMessage('Please fill in all change fields');
      setShowErrorModal(true);
      return;
    }

    // Validate rank is a number
    if (isNaN(changesRank)) {
      setErrorMessage('Rank must be a number');
      setShowErrorModal(true);
      return;
    }

    const rank = parseInt(changesRank);
    if (rank < 1) {
      setErrorMessage('Rank must be a positive number');
      setShowErrorModal(true);
      return;
    }

    const coIndex = poMapping.findIndex(co => co.CO_number === changesCO);

    if (coIndex === -1) {
      // CO doesn't exist, create a new one
      const newCO = {
        CO_number: changesCO,
        CO_Objective: CO_number.find(co => co.id.toString() === changesCO)?.description || '',
        Bloom_Level: changesBloomsTaxonomy,
        Mapped_POs: [{
          PO: changesPO,
          Justification: changesJustification,
          Rank: rank
        }]
      };
      
      setPoMapping([...poMapping, newCO]);
      showNotification(`New mapping created for CO${changesCO} and ${changesPO}`);
    } else {
      // CO exists, update it
      const updatedMapping = poMapping.map((co, index) => {
        if (index === coIndex) {
          const poIndex = co.Mapped_POs.findIndex(po => po.PO === changesPO);
          
          if (poIndex !== -1) {
            // Update existing PO mapping
            const updatedPOs = [...co.Mapped_POs];
            updatedPOs[poIndex] = {
              PO: changesPO,
              Justification: changesJustification,
              Rank: rank
            };
            
            return {
              ...co,
              Bloom_Level: changesBloomsTaxonomy,
              Mapped_POs: updatedPOs
            };
          } else {
            // Add new PO mapping
            return {
              ...co,
              Bloom_Level: changesBloomsTaxonomy,
              Mapped_POs: [
                ...co.Mapped_POs,
                {
                  PO: changesPO,
                  Justification: changesJustification,
                  Rank: rank
                }
              ]
            };
          }
        }
        return co;
      });
      
      setPoMapping(updatedMapping);
      showNotification(`Mapping updated for CO${changesCO} and ${changesPO}`);
    }

    // Reset change fields
    setChangesCO('');
    setChangesPO('');
    setChangesBloomsTaxonomy('');
    setChangesJustification('');
    setChangesRank('');
  };

  const exportToPDF = () => {
    if (poMapping.length === 0) {
      showNotification('No PO mappings to export', 'error');
      return;
    }
  
    // Create a printable HTML template
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>PO Mapping Report</title>
          <style>
            body { font-family: Arial; margin: 20px; }
            h1 { color: #333; text-align: center; }
            .course-info { margin-bottom: 20px; }
            .co-section { margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #3498db; color: white; padding: 8px; }
            td { padding: 8px; border: 1px solid #ddd; }
            .footer { margin-top: 30px; font-size: 0.8em; color: #777; }
          </style>
        </head>
        <body>
          <h1>Course Outcome and PO Mapping Report</h1>
          <div class="course-info">
            <p><strong>Course Name:</strong> ${CO_name}</p>
            <p><strong>Course ID:</strong> ${CO_ID}</p>
            <p><strong>Semester:</strong> ${sem}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          ${poMapping.map(mapping => `
            <div class="co-section">
              <h3>CO${mapping.CO_number}: ${mapping.CO_Objective}</h3>
              <p><strong>Bloom's Taxonomy Level:</strong> ${mapping.Bloom_Level}</p>
              <table>
                <thead>
                  <tr>
                    <th>PO</th>
                    <th>Justification</th>
                    <th>Rank</th>
                  </tr>
                </thead>
                <tbody>
                  ${mapping.Mapped_POs.map(po => `
                    <tr>
                      <td>${po.PO}</td>
                      <td>${po.Justification}</td>
                      <td>${po.Rank}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `).join('')}
          
          <div class="footer">
            Generated on: ${new Date().toLocaleString()}
          </div>
          
          <script>
            // Automatically trigger print and close after delay
            setTimeout(() => {
              window.print();
              setTimeout(() => window.close(), 500);
            }, 200);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const renderPOMappingTable = () => {
    if (poMapping.length === 0) {
      return (
        <div className={`flex flex-col items-center justify-center p-8 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <Frown className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            No PO Mappings Found
          </h3>
          <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No program outcome mappings have been created yet. <br />
            Use the form on the right to add your first mapping.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {poMapping.map((mapping, index) => (
          <div key={index} className={`rounded-lg overflow-hidden ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
            <div className={`p-4 ${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}>
              <h3 className="font-bold text-lg">
                CO{mapping.CO_number}: {mapping.CO_Objective}
              </h3>
              <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Bloom's Level: {mapping.Bloom_Level}
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`${isDarkMode ? "bg-gray-800" : "bg-gray-200"}`}>
                    <th className="p-3 text-left">PO</th>
                    <th className="p-3 text-left">Justification</th>
                    <th className="p-3 text-left">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {mapping.Mapped_POs.map((po, poIndex) => (
                    <tr 
                      key={poIndex} 
                      className={`border-t ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}
                    >
                      <td className="p-3">{po.PO}</td>
                      <td className="p-3 text-sm">{po.Justification}</td>
                      <td className="p-3">{po.Rank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Add this state for submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className={`relative min-h-screen p-4 overflow-hidden ${isDarkMode ? colorPalettes.dark.background : colorPalettes.light.background}`}>
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center transition-all duration-300 ${
          notification.type === 'error' 
            ? 'bg-red-500 text-white' 
            : 'bg-green-500 text-white'
        }`}>
          {notification.type === 'error' ? (
            <AlertCircle className="mr-2" />
          ) : (
            <Check className="mr-2" />
          )}
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification({ show: false, message: '', type: '' })}
            className="ml-4"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Dashboard Header */}
      <div className={`flex items-center justify-between p-4 mb-4 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center space-x-4">
          <Layers className={`w-10 h-10 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Course Outcome & PO Mapping
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Comprehensive Course Mapping Dashboard
            </p>
          </div>
        </div>
      </div>

      <div className={`rounded-xl p-6 ${isDarkMode ? colorPalettes.dark.cardBg : colorPalettes.light.cardBg}`}>
        {!isSubmitted ? (
          <>
            {/* Course Details Panel */}
            <div className={`p-6 rounded-xl shadow-lg mb-6 ${isDarkMode ? "bg-gray-800 border-l-4 border-green-600" : "bg-white border-l-4 border-green-500"}`}>
              <div className="flex items-center mb-4">
                <Navigation className={`mr-3 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
                <h2 className={`mr-3 text-xl font-semibold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>Course Details</h2>
              </div>
              
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: "Course Name", value: CO_name, setter: setCO_name },
                  { label: "Course ID", value: CO_ID, setter: setCO_ID },
                  { label: "Semester", value: sem, setter: setsem },
                  { label: "Subject", value: subject, setter: setsubject }
                ].map(({ label, value, setter }) => (
                  <input
                    key={label}
                    type="text"
                    placeholder={label}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className={`p-3 rounded-lg border focus:outline-none focus:ring-2 ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-green-500" : "bg-white border-gray-300 text-gray-900 focus:ring-green-400"}`}
                  />
                ))}
              </div>
            </div>

            {/* Course Outcomes Panel */}
            <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800 border-l-4 border-blue-600" : "bg-white border-l-4 border-blue-500"}`}>
              <div className="flex items-center mb-4">
                <BookOpen className={`mr-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
                <h2 className={`mr-3 text-xl font-semibold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>Course Outcomes (CO_number)</h2>
                <button 
                  onClick={addCO}
                  className={`ml-auto flex items-center px-3 py-2 rounded-full ${isDarkMode ? "bg-blue-900 text-blue-300 hover:bg-blue-800" : "bg-blue-200 text-blue-800 hover:bg-blue-300"}`}
                >
                  <PlusCircle className="mr-2" size={18} /> Add CO
                </button>
              </div>
              
              <div className="space-y-4">
                {CO_number.map((co) => (
                  <div key={co.id} className={`p-4 rounded-lg transition-all duration-300 ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <div className="flex justify-between items-center mb-2">
                      <label className={`font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        CO{co.id}
                      </label>
                      {CO_number.length > 1 && (
                        <button 
                          onClick={() => deleteCO(co.id)}
                          className={`p-1 rounded-full ${isDarkMode ? "text-red-400 hover:bg-gray-600" : "text-red-600 hover:bg-gray-200"}`}
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                    <textarea
                      placeholder={`Enter CO${co.id} Description`}
                      value={co.description}
                      onChange={(e) => updateCODescription(co.id, e.target.value)}
                      className={`w-full p-3 rounded-lg border min-h-[100px] focus:outline-none focus:ring-2 ${isDarkMode ? "bg-gray-600 border-gray-500 text-gray-100 focus:ring-blue-500" : "bg-white border-gray-300 text-gray-900 focus:ring-blue-400"}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button 
                onClick={handleSubmit}
                className={`px-6 py-3 rounded-lg text-lg font-semibold ${isDarkMode ? "bg-blue-900 text-blue-300 hover:bg-blue-800" : "bg-blue-200 text-blue-800 hover:bg-blue-300"}`}
              >
                Submit and Proceed to PO Mapping
              </button>
            </div>
          </>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Final PO Mapping Panel */}
            <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800 border-l-4 border-purple-600" : "bg-white border-l-4 border-purple-500"}`}>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <FileText className={`mr-3 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
                  <h2 className={`text-xl font-semibold ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                    PO Mapping Report
                  </h2>
                </div>
                <button 
                  onClick={exportToPDF}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    isDarkMode 
                      ? "bg-green-900 text-green-300 hover:bg-green-800" 
                      : "bg-green-200 text-green-800 hover:bg-green-300"
                  }`}
                >
                  <Download className="mr-2" size={18} />
                  Export PDF
                </button>
              </div>
              
              {renderPOMappingTable()}
            </div>

            {/* Make Changes Panel */}
            <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800 border-l-4 border-indigo-600" : "bg-white border-l-4 border-indigo-500"}`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>Make Changes</h2>
              
              <div className="space-y-4">
                <div>
                  <label className={`block mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>CO Number</label>
                  <select
                    value={changesCO}
                    onChange={(e) => setChangesCO(e.target.value)}
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-400"}`}
                  >
                    <option value="">Select CO Number</option>
                    {CO_number.map(co => (
                      <option key={co.id} value={co.id}>{co.id}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className={`block mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>PO</label>
                  <select
                    value={changesPO}
                    onChange={(e) => setChangesPO(e.target.value)}
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-400"}`}
                  >
                    <option value="">Select PO</option>
                    {poOptions.map(po => (
                      <option key={po} value={po}>{po}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className={`block mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Bloom's Taxonomy Level</label>
                  <select
                    value={changesBloomsTaxonomy}
                    onChange={(e) => setChangesBloomsTaxonomy(e.target.value)}
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-400"}`}
                  >
                    <option value="">Select Bloom's Level</option>
                    {bloomsLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className={`block mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Justification</label>
                  <textarea
                    placeholder="Enter Justification"
                    value={changesJustification}
                    onChange={(e) => setChangesJustification(e.target.value)}
                    className={`w-full p-3 rounded-lg border min-h-[100px] focus:outline-none focus:ring-2 ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-400"}`}
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Rank</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter Rank (e.g., 1, 2, 3)"
                    value={changesRank}
                    onChange={(e) => setChangesRank(e.target.value)}
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-400"}`}
                  />
                </div>
                
                <div className="flex justify-between items-center mt-6 space-x-4">
                  <button 
                    onClick={handleMakeChanges}
                    className={`w-1/2 px-4 py-3 rounded-lg ${isDarkMode ? "bg-indigo-900 text-indigo-300 hover:bg-indigo-800" : "bg-indigo-200 text-indigo-800 hover:bg-indigo-300"}`}
                  >
                    Apply Changes
                  </button>
                  
                  <button
                    onClick={handleSubmitMapping}
                    disabled={isSubmitting}
                    className={`w-1/2 px-4 py-3 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-green-900 text-green-300 hover:bg-green-800" : "bg-green-200 text-green-800 hover:bg-green-300"} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⌛</span>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        <span>Submit Mapping</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Renderings */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`p-6 rounded-xl shadow-2xl max-w-md w-full ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                Export Information
              </h2>
              <button 
                onClick={() => setShowInfoModal(false)}
                className={`p-2 rounded-full hover:bg-opacity-10 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className={isDarkMode ? "text-gray-100" : "text-gray-900"}>
              PDF export functionality will be available soon.
            </p>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`p-6 rounded-xl shadow-2xl max-w-md w-full text-center ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex justify-center mb-4">
              <Check className={`w-16 h-16 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <h2 className={`text-xl font-semibold mb-2 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
              Success
            </h2>
            <p className={isDarkMode ? "text-gray-100" : "text-gray-900"}>
              Operation completed successfully!
            </p>
          </div>
        </div>
      )}

      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`p-6 rounded-xl shadow-2xl max-w-md w-full ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <AlertCircle className={`w-8 h-8 mr-3 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                <h2 className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                  Error
                </h2>
              </div>
              <button 
                onClick={() => setShowErrorModal(false)}
                className={`p-2 rounded-full hover:bg-opacity-10 ${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className={isDarkMode ? "text-gray-100" : "text-gray-900"}>
              {errorMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoPODashboard;