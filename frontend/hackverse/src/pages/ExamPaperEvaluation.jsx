import React from "react";

const ExamPaperEvaluation = ({ isDarkMode }) => {
  return (
    <div
      className={`
      min-h-screen p-6 
      ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900"
      }
    `}
    >
      <h1 className="text-2xl font-bold mb-4">Exam Paper Evaluation Page</h1>
      <p>Exam Paper Evaluation content will be added here.</p>
    </div>
  );
};

export default ExamPaperEvaluation;
