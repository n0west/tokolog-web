import React from 'react';

interface CameraIconProps {
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

const CameraIcon: React.FC<CameraIconProps> = ({ 
  width = 40, 
  height = 40, 
  className = "",
  color = "#6B7280" 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M3 16.5V9C3 8.20435 3.31607 7.44129 3.87868 6.87868C4.44129 6.31607 5.20435 6 6 6H7.5L9 4.5H15L16.5 6H18C18.7956 6 19.5587 6.31607 20.1213 6.87868C20.6839 7.44129 21 8.20435 21 9V16.5C21 17.2956 20.6839 18.0587 20.1213 18.6213C19.5587 19.1839 18.7956 19.5 18 19.5H6C5.20435 19.5 4.44129 19.1839 3.87868 18.6213C3.31607 18.0587 3 17.2956 3 16.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle 
        cx="17.5" 
        cy="8.5" 
        r="1" 
        fill={color}
      />
    </svg>
  );
};

export default CameraIcon;