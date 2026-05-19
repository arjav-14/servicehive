import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'brand' | 'white';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'brand' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-[3px]',
    lg: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    brand: 'border-slate-200 border-t-brand-500 dark:border-darkBorder dark:border-t-brand-500',
    white: 'border-white/20 border-t-white',
  };

  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
