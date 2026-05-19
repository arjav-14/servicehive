import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Search,
  Filter,
  RotateCcw,
  Download,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Lock,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  User,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../hooks/useAuth';
import {
  fetchLeads,
  createLead,
  updateLead,
  deleteLead,
  setFilters,
  resetFilters,
  setActiveLead
} from '../redux/slices/leadSlice';
import { leadSchema } from '../validations/lead.validation';
import type { LeadFields } from '../validations/lead.validation';
import type { Lead, LeadStatus, LeadSource } from '../types/lead.types';
import axiosClient from '../api/axiosClient';
import DashboardLayout from '../layouts/DashboardLayout';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import useDebounce from '../hooks/useDebounce';

export const LeadsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { leads, filters, pagination, isLoading, activeLead } = useAppSelector((state) => state.leads);

  // Search input state and debouncer
  const [searchVal, setSearchVal] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchVal, 500);

  // Form modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);

  // Details view modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Form hooks
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<LeadFields>({
    resolver: zodResolver(leadSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      status: 'New',
      source: 'Website'
    }
  });

  // Sync debounced search to redux filters
  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearch, page: 1 }));
  }, [debouncedSearch, dispatch]);

  // Sync initial filters inside local input state if reset is clicked
  useEffect(() => {
    if (filters.search === '') {
      setSearchVal('');
    }
  }, [filters.search]);

  // Fetch leads on filter constraints modifications
  useEffect(() => {
    dispatch(fetchLeads());
  }, [filters, dispatch]);

  // Export leads collection as CSV download
  const handleCSVExport = async () => {
    try {
      const { status, source, search, sort } = filters;
      const params: any = {};
      if (status) params.status = status;
      if (source) params.source = source;
      if (search) params.search = search;
      if (sort) params.sort = sort;

      const response = await axiosClient.get('/leads/export', {
        params,
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `gigflow_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      // Handled by interceptor toast warnings!
    }
  };

  // Pagination triggers
  const handlePageChange = (newPage: number) => {
    dispatch(setFilters({ page: newPage }));
  };

  // Open creation form modal
  const openCreateModal = () => {
    setEditingLeadId(null);
    reset({
      name: '',
      email: '',
      status: 'New',
      source: 'Website'
    });
    setIsFormModalOpen(true);
  };

  // Open edit form modal
  const openEditModal = (lead: Lead) => {
    setEditingLeadId(lead._id);
    setValue('name', lead.name);
    setValue('email', lead.email);
    setValue('status', lead.status);
    setValue('source', lead.source);
    setIsFormModalOpen(true);
  };

  // Submit Lead creation / modifications
  const onSubmitLead = async (data: any) => {
    if (editingLeadId) {
      await dispatch(updateLead({ id: editingLeadId, leadData: data }));
    } else {
      await dispatch(createLead(data));
      dispatch(fetchLeads());
    }
    setIsFormModalOpen(false);
  };

  // Delete lead (Admin authorization required)
  const handleDeleteLead = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this lead?')) {
      await dispatch(deleteLead(id));
      dispatch(fetchLeads());
    }
  };

  // Display details modal
  const viewLeadDetails = (lead: Lead) => {
    dispatch(setActiveLead(lead));
    setIsDetailModalOpen(true);
  };

  // Badge stylers for lead statuses
  const statusBadge: Record<LeadStatus, string> = {
    New: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30',
    Contacted: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30',
    Qualified: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30',
    Lost: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30'
  };

  // Badge stylers for lead sources
  const sourceBadge: Record<LeadSource, string> = {
    Website: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30',
    Instagram: 'text-pink-600 bg-pink-50 dark:text-pink-400 dark:bg-pink-950/20 border-pink-100 dark:border-pink-900/30',
    Referral: 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/20 border-teal-100 dark:border-teal-900/30'
  };

  const isUserAdmin = user?.role === 'admin';

  return (
    <DashboardLayout title="Leads Management">
      {/* Search Filter Panel */}
      <div className="p-6 rounded-3xl bg-white dark:bg-darkCard border border-slate-100 dark:border-darkBorder shadow-sm space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Left search */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search leads by name or email..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold outline-none bg-slate-50 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:bg-darkBg dark:border-darkBorder dark:text-slate-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 transition-all duration-200"
            />
          </div>

          {/* Right quick controls */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleCSVExport}
              disabled={leads.length === 0}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={openCreateModal}
            >
              Add New Lead
            </Button>
          </div>
        </div>

        {/* Dropdown filters row */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100 dark:border-darkBorder">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filters</span>
          </div>

          {/* Status filter */}
          <div className="w-40">
            <select
              value={filters.status}
              onChange={(e) => dispatch(setFilters({ status: e.target.value, page: 1 }))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none bg-slate-50 dark:bg-darkBg dark:border-darkBorder dark:text-slate-200 cursor-pointer focus:border-brand-500 transition-colors"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Source filter */}
          <div className="w-40">
            <select
              value={filters.source}
              onChange={(e) => dispatch(setFilters({ source: e.target.value, page: 1 }))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none bg-slate-50 dark:bg-darkBg dark:border-darkBorder dark:text-slate-200 cursor-pointer focus:border-brand-500 transition-colors"
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
          </div>

          {/* Sort order filter */}
          <div className="w-40">
            <select
              value={filters.sort}
              onChange={(e) => dispatch(setFilters({ sort: e.target.value as 'latest' | 'oldest', page: 1 }))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none bg-slate-50 dark:bg-darkBg dark:border-darkBorder dark:text-slate-200 cursor-pointer focus:border-brand-500 transition-colors"
            >
              <option value="latest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {(filters.status || filters.source || filters.search || filters.sort !== 'latest') && (
            <button
              onClick={() => {
                dispatch(resetFilters());
                setSearchVal('');
              }}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid leads catalog */}
      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : leads.length === 0 ? (
        <EmptyState
          title="No Leads Found"
          description="We couldn't find any leads matching the filter query constraints. Try adding a new lead or adjusting your search parameters."
          actionLabel="Add New Lead"
          onAction={openCreateModal}
        />
      ) : (
        <div className="space-y-6">
          {/* Responsive Table Wrapper */}
          <div className="overflow-x-auto rounded-3xl border border-slate-100 dark:border-darkBorder bg-white dark:bg-darkCard shadow-sm">
            <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
              <thead className="bg-slate-55/60 dark:bg-darkBg/30 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 border-b border-slate-100 dark:border-darkBorder">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold">Name</th>
                  <th scope="col" className="px-6 py-4 font-bold">Email</th>
                  <th scope="col" className="px-6 py-4 font-bold">Status</th>
                  <th scope="col" className="px-6 py-4 font-bold">Source</th>
                  <th scope="col" className="px-6 py-4 font-bold">Owner</th>
                  <th scope="col" className="px-6 py-4 font-bold">Created Date</th>
                  <th scope="col" className="px-6 py-4 font-bold text-right pr-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-darkBorder">
                {leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/50 dark:hover:bg-darkBg/10 transition-colors">
                    {/* Name */}
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                      {lead.name}
                    </td>
                    {/* Email */}
                    <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">
                      {lead.email}
                    </td>
                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${statusBadge[lead.status] || 'text-slate-500 border-slate-200'}`}>
                        {lead.status}
                      </span>
                    </td>
                    {/* Source badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${sourceBadge[lead.source] || 'text-slate-500 border-slate-200'}`}>
                        {lead.source}
                      </span>
                    </td>
                    {/* Creator Owner */}
                    <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400">
                      {lead.createdBy?.name || 'Workspace'}
                    </td>
                    {/* Date */}
                    <td className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    {/* Actions buttons */}
                    <td className="px-6 py-4 text-right pr-8">
                      <div className="flex items-center justify-end space-x-2">
                        {/* View details */}
                        <button
                          onClick={() => viewLeadDetails(lead)}
                          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-darkBg/50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(lead)}
                          className="p-2 rounded-xl text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/20 transition-colors"
                          title="Edit Lead"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {/* Delete with RBAC checks */}
                        {isUserAdmin ? (
                          <button
                            onClick={() => handleDeleteLead(lead._id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span
                            className="p-2 rounded-xl text-slate-300 dark:text-slate-600 cursor-not-allowed"
                            title="Admin Privilege Only"
                          >
                            <Lock className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controllers */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4">
              <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                Showing Page <span className="text-slate-700 dark:text-slate-300 font-bold">{pagination.page}</span> of <span className="text-slate-700 dark:text-slate-300 font-bold">{pagination.totalPages}</span> ({pagination.total} leads)
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Creation / Editing Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="w-full max-w-lg p-8 rounded-3xl bg-white dark:bg-darkCard border border-slate-100 dark:border-darkBorder shadow-2xl space-y-6 animate-scaleIn">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-brand-500" />
                <span>{editingLeadId ? 'Modify Lead Record' : 'Add New Pipeline Lead'}</span>
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-darkBg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitLead)} className="space-y-5">
              <Input
                label="Lead Name"
                placeholder="Candidate Full Name"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email Address"
                placeholder="name@gmail.com"
                type="email"
                error={errors.email?.message}
                {...register('email')}
              />

              <Select
                label="Acquisition Channel"
                options={[
                  { value: 'Website', label: 'Website Form' },
                  { value: 'Instagram', label: 'Instagram Chat' },
                  { value: 'Referral', label: 'Referral Direct' }
                ]}
                error={errors.source?.message}
                {...register('source')}
              />

              <Select
                label="Conversion Status"
                options={[
                  { value: 'New', label: 'New Inquiry' },
                  { value: 'Contacted', label: 'Contacted Rep' },
                  { value: 'Qualified', label: 'Qualified Prospect' },
                  { value: 'Lost', label: 'Lost Opportunity' }
                ]}
                error={errors.status?.message}
                {...register('status')}
              />

              <div className="flex justify-end items-center space-x-3 pt-4 border-t border-slate-150 dark:border-darkBorder">
                <Button
                  variant="outline"
                  size="md"
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  {editingLeadId ? 'Save Changes' : 'Create Record'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {isDetailModalOpen && activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
          <div className="w-full max-w-lg p-8 rounded-3xl bg-white dark:bg-darkCard border border-slate-100 dark:border-darkBorder shadow-2xl space-y-6 animate-scaleIn">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Lead Specification Profile
              </h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-darkBg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile contents */}
            <div className="space-y-6">
              {/* Profile Card Header */}
              <div className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-darkBg/20 border border-slate-100 dark:border-darkBorder">
                <div className="p-4 rounded-xl bg-brand-500 text-white shadow-md shadow-brand-500/10">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    {activeLead.name}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge[activeLead.status]}`}>
                      {activeLead.status}
                    </span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${sourceBadge[activeLead.source]}`}>
                      {activeLead.source}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data specifications */}
              <div className="space-y-3.5 text-sm font-semibold">
                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>Email:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{activeLead.email}</span>
                </div>

                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Creator:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">
                    {activeLead.createdBy?.name || 'Workspace Account'} ({activeLead.createdBy?.role || 'sales'})
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Created At:</span>
                  <span className="text-slate-850 dark:text-slate-200 font-bold">
                    {new Date(activeLead.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Last Modified:</span>
                  <span className="text-slate-850 dark:text-slate-200 font-bold">
                    {new Date(activeLead.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-150 dark:border-darkBorder">
                <Button variant="primary" size="md" onClick={() => setIsDetailModalOpen(false)}>
                  Close Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LeadsList;
