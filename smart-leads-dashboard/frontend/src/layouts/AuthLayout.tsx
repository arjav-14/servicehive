import React from 'react';
import { Award, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-slate-50 dark:bg-darkBg transition-colors duration-200 relative">
      {/* Theme Toggler */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2.5 rounded-xl bg-white dark:bg-darkCard border border-slate-200/60 dark:border-darkBorder text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-darkBg shadow-sm transition-all"
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="w-full max-w-md">
        {/* Logo Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3.5 rounded-2xl bg-brand-500 text-white shadow-xl shadow-brand-500/20 mb-3">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-50">
            Smart Leads Dashboard
          </h2>
          <p className="mt-1.5 text-sm text-slate-400 dark:text-slate-500 font-medium">
            GigFlow Enterprise Portal
          </p>
        </div>

        {/* Card Body */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-darkCard border border-slate-100 dark:border-darkBorder shadow-xl shadow-slate-200/30 dark:shadow-none">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
