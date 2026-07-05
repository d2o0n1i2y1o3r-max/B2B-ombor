import React from 'react';

const ProgressBar = ({ progress = 0, className = "" }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
      <div
        className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};

export default ProgressBar;
