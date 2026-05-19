import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldAlert, Award } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leads List', href: '/leads', icon: Users },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-slate-950 text-slate-400 border-r border-slate-900 shrink-0">
      {/* Logo Branding */}
      <div className="flex items-center h-20 px-8 border-b border-slate-900">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-wider block">
              GigFlow
            </span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest block -mt-1">
              Smart Leads
            </span>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-250
                ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                    : 'hover:bg-slate-900 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Session Security Card */}
      {user && (
        <div className="p-6 m-4 rounded-2xl bg-slate-900/60 border border-slate-900">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-slate-950 text-brand-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Security Role
              </p>
              <p className="text-sm font-bold text-slate-200 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
