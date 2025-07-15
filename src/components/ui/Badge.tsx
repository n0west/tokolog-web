import React from 'react';

interface BadgeProps {
  type: 'otoku' | 'gaman';
  size?: 'sm' | 'md';
}

export const Badge = ({ type, size = 'md' }: BadgeProps) => {
  const baseClasses = 'font-bold rounded-md px-2 py-1';
  const typeClasses = {
    otoku: 'text-blue-500 bg-blue-50',
    gaman: 'text-red-500 bg-red-50'
  };
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm'
  };

  return (
    <span className={`${baseClasses} ${typeClasses[type]} ${sizeClasses[size]}`}>
      {type === 'otoku' ? 'おトク' : 'ガマン'}
    </span>
  );
};