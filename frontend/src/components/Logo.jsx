import React from 'react';

const Logo = ({ isDark, showText = true, size = 'md' }) => {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-4xl' },
  };

  const currentSize = sizes[size] || sizes.md;
  const iconSize = currentSize.icon;

  return (
    <div className="flex items-center gap-2">
      {/* Warehouse Icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Warehouse/Box shape - outline style */}
        <path
          d="M4 18L24 8L44 18V40C44 42.2091 42.2091 44 40 44H8C5.79086 44 4 42.2091 4 40V18Z"
          stroke={isDark ? '#1D9E75' : '#1D9E75'}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Roof lines */}
        <path
          d="M4 18L24 28L44 18"
          stroke={isDark ? '#1D9E75' : '#1D9E75'}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Door opening */}
        <path
          d="M18 44V32C18 30.8954 18.8954 30 20 30H28C29.1046 30 30 30.8954 30 32V44"
          stroke={isDark ? '#1D9E75' : '#1D9E75'}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* SkladBor Text */}
      {showText && (
        <span
          className={`font-bold ${currentSize.text}`}
          style={{ color: '#1D9E75' }}
        >
          SkladBor
        </span>
      )}
    </div>
  );
};

export default Logo;
