import React from 'react';
import { LogOut, Sun, Moon, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../redux/slices/authSlice';
import { useTheme } from '../../hooks/useTheme';

interface NavbarProps {
  title: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const { user, dispatch } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-20 px-8 bg-white/70 dark:bg-darkCard/70 border-b border-slate-100 dark:border-darkBorder backdrop-blur-md">
      <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-50">
        {title}
      </h1>

      <div className="flex items-center space-x-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-darkBg text-slate-500 dark:text-slate-400 transition-colors"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Vertical Separator */}
        <div className="h-6 w-px bg-slate-100 dark:bg-darkBorder" />

        {/* User Card */}
        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-500 dark:text-brand-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {user.name}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-darkBg text-slate-500 dark:text-slate-400 mt-0.5 inline-block">
                  {user.role}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
