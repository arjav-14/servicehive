import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex w-screen h-screen overflow-hidden bg-slate-50 dark:bg-darkBg transition-colors duration-200">
      {/* Responsive Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        {/* Navigation Bar */}
        <Navbar title={title} />

        {/* Work Area scroll panel */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto px-6 py-8 sm:px-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
