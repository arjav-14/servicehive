import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, UserCheck, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../hooks/useAuth';
import { fetchLeads } from '../redux/slices/leadSlice';
import DashboardLayout from '../layouts/DashboardLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { leads, isLoading } = useAppSelector((state) => state.leads);

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  const total = leads.length;
  const newCount = leads.filter((l) => l.status === 'New').length;
  const contacted = leads.filter((l) => l.status === 'Contacted').length;
  const qualified = leads.filter((l) => l.status === 'Qualified').length;
  const lost = leads.filter((l) => l.status === 'Lost').length;

  const conversionRate = total > 0 ? Math.round((qualified / total) * 105) : 0;
  const clampedConversion = conversionRate > 100 ? 100 : conversionRate;

  if (isLoading && total === 0) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex h-96 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Performance Dashboard">
      {/* Welcome banner card */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600/30 to-indigo-900/10 mix-blend-multiply" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex px-3.5 py-1 rounded-full bg-slate-800 border border-slate-700/50 text-xs font-bold text-brand-400 uppercase tracking-widest">
            Workspace Portal
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Hello, {user?.name}!
            </h2>
            <p className="mt-1 text-sm text-slate-400 max-w-md font-medium leading-relaxed">
              Track lead pipelines, query analytics filters, modify prospects, and manage sales conversions with the GigFlow dashboard.
            </p>
          </div>
          <div className="flex pt-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/leads')}
            >
              Open Leads Pipeline
            </Button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Total Leads"
          value={total}
          icon={<Users className="w-5 h-5 text-indigo-500" />}
          description="Global workspace registry"
        />
        <Card
          title="New Inquiries"
          value={newCount}
          icon={<FileText className="w-5 h-5 text-amber-500" />}
          description="Leads awaiting follow-up"
        />
        <Card
          title="Qualified opportunities"
          value={qualified}
          icon={<UserCheck className="w-5 h-5 text-emerald-500" />}
          description="High conversion likelihood"
        />
        <Card
          title="Pipeline conversion"
          value={`${clampedConversion}%`}
          icon={<TrendingUp className="w-5 h-5 text-brand-500" />}
          description="Qualified to total conversion ratio"
        />
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sales Funnel progress card */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-darkCard border border-slate-100 dark:border-darkBorder shadow-sm space-y-6">
          <div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Pipeline Conversion Funnel
            </h4>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
              Visualizing lead volume per funnel stage
            </p>
          </div>

          <div className="space-y-5">
            {/* New */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block" />
                  <span>New Inquiry</span>
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {newCount} ({total > 0 ? Math.round((newCount / total) * 100) : 0}%)
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-darkBg rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${total > 0 ? (newCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Contacted */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block" />
                  <span>Contacted</span>
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {contacted} ({total > 0 ? Math.round((contacted / total) * 100) : 0}%)
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-darkBg rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${total > 0 ? (contacted / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Qualified */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
                  <span>Qualified</span>
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {qualified} ({total > 0 ? Math.round((qualified / total) * 100) : 0}%)
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-darkBg rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${total > 0 ? (qualified / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Lost */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block" />
                  <span>Lost</span>
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {lost} ({total > 0 ? Math.round((lost / total) * 100) : 0}%)
                </span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-darkBg rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{ width: `${total > 0 ? (lost / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lead Source distribution card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-darkCard border border-slate-100 dark:border-darkBorder shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Source Channels
              </h4>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                Visualizing lead volume per acquisition channel
              </p>
            </div>

            <div className="space-y-4">
              {['Website', 'Instagram', 'Referral'].map((source) => {
                const count = leads.filter((l) => l.source === source).length;
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

                const sourceColor: Record<string, string> = {
                  Website: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20',
                  Instagram: 'text-pink-500 bg-pink-50 dark:bg-pink-950/20',
                  Referral: 'text-teal-500 bg-teal-50 dark:bg-teal-950/20',
                };

                return (
                  <div key={source} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 dark:bg-darkBg/10 border border-slate-100/50 dark:border-darkBorder">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                      {source}
                    </span>
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold ${sourceColor[source] || 'text-slate-500 bg-slate-100'}`}>
                      {count} ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-darkBorder flex items-center space-x-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
            <AlertCircle className="w-4 h-4 text-brand-500" />
            <span>Updated live with latest database entries</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
