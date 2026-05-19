import Lead from '../models/lead.model';
import { ILead } from '../interfaces/lead.interface';
import { ApiError } from '../utils/apiError';
import { Types } from 'mongoose';

export interface LeadFilters {
  status?: string;
  source?: string;
  search?: string;
  sort?: 'latest' | 'oldest';
  page?: number;
  limit?: number;
}

export class LeadService {
  public static async createLead(leadData: Partial<ILead>, userId: string): Promise<ILead> {
    const lead = await Lead.create({
      ...leadData,
      createdBy: new Types.ObjectId(userId),
    });
    return (await lead.populate('createdBy', 'name email role'));
  }

  public static async getLeads(filters: LeadFilters): Promise<{
    leads: ILead[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { status, source, search, sort = 'latest', page = 1, limit = 10 } = filters;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'latest') {
      sortOption = { createdAt: -1 };
    }

    const total = await Lead.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email role');

    return {
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  public static async getLeadById(id: string): Promise<ILead> {
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid Lead ID format');
    }
    const lead = await Lead.findById(id).populate('createdBy', 'name email role');
    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }
    return lead;
  }

  public static async updateLead(id: string, leadData: Partial<ILead>): Promise<ILead> {
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid Lead ID format');
    }
    const lead = await Lead.findByIdAndUpdate(id, leadData, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email role');

    if (!lead) {
      throw new ApiError(404, 'Lead not found');
    }
    return lead;
  }

  public static async deleteLead(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid Lead ID format');
    }
    const result = await Lead.findByIdAndDelete(id);
    if (!result) {
      throw new ApiError(404, 'Lead not found');
    }
  }

  public static async generateCSVString(filters: Omit<LeadFilters, 'page' | 'limit'>): Promise<string> {
    const { status, source, search, sort = 'latest' } = filters;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const leads = await Lead.find(query)
      .sort(sortOption)
      .populate('createdBy', 'name');

    const headers = ['Lead ID', 'Name', 'Email', 'Status', 'Source', 'Created By', 'Created At'];
    const csvRows = [headers.join(',')];

    for (const lead of leads) {
      const createdByName = (lead.createdBy as any)?.name || 'N/A';
      const row = [
        lead._id.toString(),
        `"${lead.name.replace(/"/g, '""')}"`,
        `"${lead.email.replace(/"/g, '""')}"`,
        lead.status,
        lead.source,
        `"${createdByName.replace(/"/g, '""')}"`,
        lead.createdAt.toISOString(),
      ];
      csvRows.push(row.join(','));
    }

    return csvRows.join('\n');
  }
}
export default LeadService;
