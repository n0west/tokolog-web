import React from 'react';

interface CheckIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const CheckIcon: React.FC<CheckIconProps> = ({
  width = 32,
  height = 32,
  color = '#10B981',
  className = '',
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
        d="M9 12l2 2 4-4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckIcon;