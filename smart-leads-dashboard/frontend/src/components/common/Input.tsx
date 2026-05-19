import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type = 'text', className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          {label}
        </label>
        <input
          ref={ref}
          type={type}
          className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 outline-none
            bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10
            dark:bg-darkCard dark:border-darkBorder dark:text-slate-100 dark:focus:bg-darkBg/30 dark:focus:border-brand-500 dark:focus:ring-brand-500/20
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-500/20' : ''} 
            ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-2 text-xs font-semibold text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
