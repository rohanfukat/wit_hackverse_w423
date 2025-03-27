import React, { useContext, useState } from "react";
import { ThemeContext } from "../App";
import { FileUp, FileText, BookOpen, Send, X, CheckCircle } from "lucide-react";

const ExamPaperEvaluation = ({ className }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [subject, setSubject] = useState("");
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);
  const [popupType, setPopupType] = useState('success');
  
  // PDF states
  const [questionPdf, setQuestionPdf] = useState(null);
  const [extractedQuestions, setExtractedQuestions] = useState(null);

  // Add new state for analysis results
  const [analysisResults, setAnalysisResults] = useState(null);

  // Show popup with message and type
  const showPopup = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
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

  const handleQuestionPdfUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('pdf')) {
      showPopup('Please upload a PDF file', 'error');
      return;
    }

    setQuestionPdf(file);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload-exam-paper', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload question paper');
      }

      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        setExtractedQuestions(data.questions);
        showPopup(`Successfully extracted ${data.questions.length} questions!`);
      } else {
        throw new Error('No questions could be extracted from the PDF');
      }
    } catch (error) {
      setQuestionPdf(null); // Reset the file input
      showPopup(error.message || 'Error uploading question paper', 'error');
    }
  };

  const handleFinalSubmit = async () => {
    if (!subject || !questionPdf || !extractedQuestions) {
      showPopup('Please complete all required fields and upload the question paper', 'error');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/evaluate-exam-paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          questions: extractedQuestions
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to process evaluation');
      }

      const data = await response.json();
      setAnalysisResults(data.analysis);
      showPopup('Evaluation processed successfully!');
      setIsSubmitted(true);
    } catch (error) {
      showPopup(error.message || 'Error processing evaluation', 'error');
    }
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100" : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900"} ${className}`}>
      {/* Popup Notification */}
      {popupMessage && <Popup message={popupMessage} type={popupType} />}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <h1 className="text-2xl font-bold mb-2">Exam Paper Evaluation</h1>
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Upload and analyze exam papers</p>
        </div>

        {/* Subject Input */}
        <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex items-center mb-4">
            <BookOpen className={`mr-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
            <h2 className="text-xl font-semibold">Subject Details</h2>
          </div>
          <input
            type="text"
            placeholder="Enter Subject Name"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={`w-full p-3 rounded-lg border ${isDarkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`}
          />
        </div>

        {/* Question Paper Upload Section */}
        <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex items-center mb-4">
            <FileText className={`mr-3 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
            <h2 className="text-xl font-semibold">Question Paper Upload</h2>
          </div>
          
          <div className={`border-2 border-dashed rounded-lg p-6 ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}>
            <input
              type="file"
              accept=".pdf"
              onChange={handleQuestionPdfUpload}
              className="hidden"
              id="question-pdf-upload"
            />
            <label
              htmlFor="question-pdf-upload"
              className={`flex items-center justify-center cursor-pointer ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
            >
              <FileUp className="mr-2" />
              {questionPdf ? questionPdf.name : "Choose Question Paper PDF"}
            </label>
          </div>

          {extractedQuestions && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Extracted Questions ({extractedQuestions.length})</h3>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {extractedQuestions.map((q, index) => (
                  <div key={index} className={`p-2 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <p>Page {q.page}: {q.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleFinalSubmit}
            disabled={!subject || !questionPdf}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center
              ${!subject || !questionPdf
                ? "bg-gray-400 cursor-not-allowed"
                : isDarkMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
          >
            <Send className="mr-2" />
            Submit for Evaluation
          </button>
        </div>

        {/* Add this section to display analysis results after the question upload section */}
        {isSubmitted && analysisResults && (
          <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex items-center mb-6">
              <FileText className={`mr-3 ${isDarkMode ? "text-green-400" : "text-green-600"}`} />
              <h2 className="text-xl font-semibold">Question Analysis Results</h2>
            </div>
            
            <div className="space-y-6">
              {analysisResults.map((analysis, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-lg border ${
                    isDarkMode 
                      ? "bg-gray-700 border-gray-600" 
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isDarkMode ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-800"
                    }`}>
                      Q{index + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`text-lg mb-4 ${
                        isDarkMode ? "text-gray-200" : "text-gray-700"
                      }`}>
                        {analysis.question_text}
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Aligned COs */}
                        <div className={`p-4 rounded-lg ${
                          isDarkMode ? "bg-gray-800" : "bg-white"
                        }`}>
                          <h3 className="font-medium mb-3">Aligned Course Outcomes</h3>
                          <div className="flex flex-wrap gap-2">
                            {analysis.aligned_COs.map((co, i) => (
                              <span
                                key={i}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  isDarkMode 
                                    ? "bg-blue-900 text-blue-200" 
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {co}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Alignment Strength */}
                        <div className={`p-4 rounded-lg ${
                          isDarkMode ? "bg-gray-800" : "bg-white"
                        }`}>
                          <h3 className="font-medium mb-3">Alignment Strength</h3>
                          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                            analysis.alignment_strength === 'High'
                              ? isDarkMode 
                                ? "bg-green-900 text-green-200" 
                                : "bg-green-100 text-green-800"
                              : analysis.alignment_strength === 'Medium'
                                ? isDarkMode
                                  ? "bg-yellow-900 text-yellow-200"
                                  : "bg-yellow-100 text-yellow-800"
                                : isDarkMode
                                  ? "bg-red-900 text-red-200"
                                  : "bg-red-100 text-red-800"
                          }`}>
                            {analysis.alignment_strength}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className={`mt-6 p-6 rounded-lg ${
              isDarkMode ? "bg-gray-700" : "bg-gray-50"
            }`}>
              <h3 className="font-semibold mb-4">Analysis Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                  <p className="text-sm text-gray-500">Total Questions</p>
                  <p className="text-2xl font-bold">{analysisResults.length}</p>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                  <p className="text-sm text-gray-500">High Alignment</p>
                  <p className="text-2xl font-bold">
                    {analysisResults.filter(a => a.alignment_strength === 'High').length}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                  <p className="text-sm text-gray-500">Medium/Low Alignment</p>
                  <p className="text-2xl font-bold">
                    {analysisResults.filter(a => a.alignment_strength !== 'High').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPaperEvaluation;