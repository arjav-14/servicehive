import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-4 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';
  
  const variantClasses = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/10 focus:ring-brand-500/20 dark:bg-brand-500 dark:hover:bg-brand-600 dark:shadow-brand-500/5',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-200 dark:bg-darkCard dark:hover:bg-darkBorder dark:text-slate-200 dark:focus:ring-darkBorder',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/10 focus:ring-red-500/20 dark:bg-red-600 dark:hover:bg-red-700 dark:shadow-red-600/5',
    outline: 'border border-slate-200 hover:bg-slate-100/50 text-slate-700 focus:ring-slate-100 dark:border-darkBorder dark:hover:bg-darkBorder/30 dark:text-slate-300 dark:focus:ring-darkBorder/40',
    ghost: 'hover:bg-slate-100 text-slate-700 focus:ring-slate-100 dark:hover:bg-darkBorder/30 dark:text-slate-300 dark:focus:ring-darkBorder/40',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="mr-2">
          <Spinner size="sm" color={variant === 'primary' || variant === 'danger' ? 'white' : 'brand'} />
        </span>
      )}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
