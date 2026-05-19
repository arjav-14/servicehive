import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LeadState, Lead, LeadFilters, LeadListResponse, SingleLeadResponse } from '../../types/lead.types';
import axiosClient from '../../api/axiosClient';

const initialState: LeadState = {
  leads: [],
  pagination: null,
  filters: {
    status: '',
    source: '',
    search: '',
    sort: 'latest',
    page: 1,
  },
  isLoading: false,
  error: null,
  activeLead: null,
};

export const fetchLeads = createAsyncThunk(
  'leads/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { leads: LeadState };
      const { status, source, search, sort, page } = state.leads.filters;
      
      const params: any = { page, limit: 10 };
      if (status) params.status = status;
      if (source) params.source = source;
      if (search) params.search = search;
      if (sort) params.sort = sort;

      const response = await axiosClient.get<LeadListResponse>('/leads', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leads');
    }
  }
);

export const createLead = createAsyncThunk(
  'leads/create',
  async (leadData: any, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post<SingleLeadResponse>('/leads', leadData);
      return response.data.data.lead;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create lead');
    }
  }
);

export const updateLead = createAsyncThunk(
  'leads/update',
  async ({ id, leadData }: { id: string; leadData: any }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put<SingleLeadResponse>(`/leads/${id}`, leadData);
      return response.data.data.lead;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update lead');
    }
  }
);

export const deleteLead = createAsyncThunk(
  'leads/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/leads/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete lead');
    }
  }
);

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<LeadFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setActiveLead: (state, action: PayloadAction<Lead | null>) => {
      state.activeLead = action.payload;
    },
    clearLeadError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Leads
    builder.addCase(fetchLeads.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchLeads.fulfilled, (state, action: PayloadAction<LeadListResponse>) => {
      state.isLoading = false;
      state.leads = action.payload.data;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchLeads.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Lead
    builder.addCase(createLead.fulfilled, (state) => {
      state.isLoading = false;
    });

    // Update Lead
    builder.addCase(updateLead.fulfilled, (state, action: PayloadAction<Lead>) => {
      state.isLoading = false;
      state.leads = state.leads.map((l) => (l._id === action.payload._id ? action.payload : l));
      if (state.activeLead && state.activeLead._id === action.payload._id) {
        state.activeLead = action.payload;
      }
    });

    // Delete Lead
    builder.addCase(deleteLead.fulfilled, (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.leads = state.leads.filter((l) => l._id !== action.payload);
      if (state.pagination) {
        state.pagination.total -= 1;
      }
    });
  },
});

export const { setFilters, resetFilters, setActiveLead, clearLeadError } = leadSlice.actions;
export default leadSlice.reducer;
