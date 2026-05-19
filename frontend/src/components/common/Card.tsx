import React from 'react';

interface CardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className = '',
}) => {
  return (
    <div className={`p-6 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md
      dark:bg-darkCard dark:border-darkBorder ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-darkBg text-slate-500 dark:text-slate-400">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-50">
          {value}
        </h3>
        {(description || trend) && (
          <div className="flex items-center mt-2 space-x-2 text-xs">
            {trend && (
              <span
                className={`font-semibold ${
                  trend.isPositive
                    ? 'text-emerald-500'
                    : 'text-rose-500'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
            )}
            {description && (
              <span className="text-slate-400 dark:text-slate-500">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
