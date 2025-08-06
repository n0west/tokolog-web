import React from 'react';

interface TrashIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const TrashIcon: React.FC<TrashIconProps> = ({
  width = 20,
  height = 20,
  color = '#9CA3AF',
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
        d="M3 6h18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="10"
        y1="11"
        x2="10"
        y2="17"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="14"
        y1="11"
        x2="14"
        y2="17"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TrashIcon;