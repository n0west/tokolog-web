import React from 'react';

interface EditIconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

const EditIcon: React.FC<EditIconProps> = ({
  width = 24,
  height = 24,
  color = '#6B7280',
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
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EditIcon;