import React from "react";

const CoPOAttainment = ({ isDarkMode }) => {
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
      <h1 className="text-2xl font-bold mb-4">Co-PO Attainment Page</h1>
      <p>Co-PO Attainment content will be added here.</p>
    </div>
  );
};

export default CoPOAttainment;
