import type { User } from './auth.types';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LeadFilters {
  status?: string;
  source?: string;
  search?: string;
  sort: 'latest' | 'oldest';
  page: number;
}

export interface LeadState {
  leads: Lead[];
  pagination: PaginationMeta | null;
  filters: LeadFilters;
  isLoading: boolean;
  error: string | null;
  activeLead: Lead | null;
}

export interface LeadListResponse {
  success: boolean;
  message: string;
  data: Lead[];
  pagination: PaginationMeta;
}

export interface SingleLeadResponse {
  success: boolean;
  message: string;
  data: {
    lead: Lead;
  };
}
