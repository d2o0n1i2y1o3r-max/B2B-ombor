import React from 'react';
import Spinner from './Spinner';

const AILoader = ({ text = "AI o'ylayapti..." }) => {
  return (
    <div className="flex items-center gap-2">
      <Spinner size="sm" />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
};

export default AILoader;
