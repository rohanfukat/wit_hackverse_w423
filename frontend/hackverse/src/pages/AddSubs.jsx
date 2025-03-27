import React, { useState, useContext } from 'react';
import { ThemeContext } from "../App";
import { Trash2, Plus, FileText, BookOpen } from 'lucide-react';

const AddSubs = ({ className }) => {
  const { isDarkMode } = useContext(ThemeContext);

  // State for form inputs
  const [subjectName, setSubjectName] = useState('');
  const [sem, setSem] = useState('');
  const [syllabus, setSyllabus] = useState(null);
  const [subjectList, setSubjectList] = useState([]);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setSyllabus(file);
  };

  // Add subject to list
  const handleAddSubject = () => {
    if (subjectName && sem && syllabus) {
      const newSubject = {
        id: Date.now(),
        subjectName,
        sem,
        syllabusName: syllabus.name
      };

      setSubjectList([...subjectList, newSubject]);
      
      // Reset form
      setSubjectName('');
      setSem('');
      setSyllabus(null);
      
      // Reset file input
      if (document.getElementById('syllabus-upload')) {
        document.getElementById('syllabus-upload').value = '';
      }
    }
  };

  // Delete subject from list
  const handleDeleteSubject = (id) => {
    setSubjectList(subjectList.filter(subject => subject.id !== id));
  };

  return (
    <div
      className={`
        min-h-screen p-6 flex items-center justify-center
        ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
            : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900"
        }
        ${className}
      `}
    >
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Main Container with Soft Shadow and Rounded Corners */}
        <div 
          className={`
            rounded-2xl overflow-hidden shadow-2xl
            ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }
          `}
        >
          {/* Header Section */}
          <div 
            className={`
              p-6 flex items-center justify-between
              ${
                isDarkMode
                  ? "bg-gray-700 border-b border-gray-600"
                  : "bg-gray-100 border-b border-gray-200"
              }
            `}
          >
            <div className="flex items-center space-x-4">
              <BookOpen 
                className={`
                  ${
                    isDarkMode 
                      ? "text-green-400" 
                      : "text-green-600"
                  }
                `} 
                size={32} 
              />
              <h1 className="text-2xl font-bold tracking-tight">Subject Management</h1>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Left Side: Add Subject Form */}
            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold text-sm">Subject Name</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Advanced Programming"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className={`
                      w-full p-3 pl-10 rounded-xl border-2 transition duration-300
                      focus:outline-none focus:ring-2
                      ${
                        isDarkMode
                          ? `
                            bg-gray-700 border-gray-600 text-gray-100
                            focus:ring-blue-500 focus:border-blue-500
                          `
                          : `
                            bg-white border-gray-300 text-gray-900
                            focus:ring-blue-400 focus:border-blue-400
                          `
                      }
                    `}
                  />
                  <BookOpen 
                    className={`
                      absolute left-3 top-1/2 -translate-y-1/2
                      ${
                        isDarkMode 
                          ? "text-gray-400" 
                          : "text-gray-500"
                      }
                    `} 
                    size={20} 
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-sm">Semester</label>
                <select
                  value={sem}
                  onChange={(e) => setSem(e.target.value)}
                  className={`
                    w-full p-3 rounded-xl border-2 transition duration-300
                    focus:outline-none focus:ring-2
                    ${
                      isDarkMode
                        ? `
                          bg-gray-700 border-gray-600 text-gray-100
                          focus:ring-blue-500 focus:border-blue-500
                        `
                        : `
                          bg-white border-gray-300 text-gray-900
                          focus:ring-blue-400 focus:border-blue-400
                        `
                    }
                  `}
                >
                  <option value="">Select Semester</option>
                  {['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'].map(semester => (
                    <option key={semester} value={semester}>{semester}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-sm">Upload Syllabus</label>
                <div className="relative">
                  <input
                    id="syllabus-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className={`
                      w-full p-3 rounded-xl border-2 file:mr-4 file:rounded-lg file:border-0
                      file:px-4 file:py-2 file:text-sm file:font-semibold
                      transition duration-300 focus:outline-none focus:ring-2
                      ${
                        isDarkMode
                          ? `
                            bg-gray-700 border-gray-600 text-gray-100
                            file:bg-blue-800 file:text-blue-200
                            focus:ring-blue-500 focus:border-blue-500
                          `
                          : `
                            bg-white border-gray-300 text-gray-900
                            file:bg-blue-500 file:text-white
                            focus:ring-blue-400 focus:border-blue-400
                          `
                      }
                    `}
                  />
                  <FileText 
                    className={`
                      absolute left-3 top-1/2 -translate-y-1/2
                      ${
                        isDarkMode 
                          ? "text-gray-400" 
                          : "text-gray-500"
                      }
                    `} 
                    size={20} 
                  />
                </div>
              </div>

              <button
                onClick={handleAddSubject}
                disabled={!subjectName || !sem || !syllabus}
                className={`
                  w-full flex items-center justify-center space-x-2 p-3 rounded-xl 
                  transition duration-300 transform hover:scale-[1.02]
                  ${
                    isDarkMode
                      ? `
                        bg-blue-700 text-blue-100 hover:bg-blue-600
                        ${(!subjectName || !sem || !syllabus) ? 'opacity-50 cursor-not-allowed' : ''}
                      `
                      : `
                        bg-blue-500 text-white hover:bg-blue-600
                        ${(!subjectName || !sem || !syllabus) ? 'opacity-50 cursor-not-allowed' : ''}
                      `
                  }
                `}
              >
                <Plus size={20} />
                <span>Add Subject</span>
              </button>
            </div>

            {/* Right Side: Subject List */}
            <div>
              <h2 className="text-xl font-bold mb-6 tracking-tight">Your Subjects</h2>
              {subjectList.length === 0 ? (
                <div 
                  className={`
                    text-center py-12 rounded-xl border-2 border-dashed
                    ${
                      isDarkMode
                        ? "border-gray-600 text-gray-500"
                        : "border-gray-300 text-gray-400"
                    }
                  `}
                >
                  <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No subjects added yet</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {subjectList.map((subject) => (
                    <div 
                      key={subject.id}
                      className={`
                        rounded-xl p-5 relative overflow-hidden
                        transition duration-300 transform hover:scale-[1.02] hover:shadow-lg
                        ${
                          isDarkMode
                            ? "bg-gray-700 border border-gray-600"
                            : "bg-white border border-gray-200 shadow-sm"
                        }
                      `}
                    >
                      <button
                        onClick={() => handleDeleteSubject(subject.id)}
                        className={`
                          absolute top-3 right-3 p-2 rounded-full 
                          hover:bg-opacity-20 transition duration-300 z-10
                          ${
                            isDarkMode
                              ? "text-red-400 hover:bg-red-500"
                              : "text-red-500 hover:bg-red-500"
                          }
                        `}
                      >
                        <Trash2 size={20} />
                      </button>
                      <div className="space-y-3">
                        <h3 className="font-bold text-lg truncate mb-2">{subject.subjectName}</h3>
                        <div className="flex justify-between space-x-2">
                          <span 
                            className={`
                              px-3 py-1 rounded-full text-xs font-medium
                              ${
                                isDarkMode
                                  ? "bg-blue-800 text-blue-200"
                                  : "bg-blue-100 text-blue-800"
                              }
                            `}
                          >
                            Semester {subject.sem}
                          </span>
                          <span 
                            className={`
                              px-3 py-1 rounded-full text-xs truncate max-w-[150px] font-medium
                              ${
                                isDarkMode
                                  ? "bg-green-800 text-green-200"
                                  : "bg-green-100 text-green-800"
                              }
                            `}
                            title={subject.syllabusName}
                          >
                            {subject.syllabusName}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubs;