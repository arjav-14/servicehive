import { Request, Response, NextFunction } from 'express';
import LeadService from '../services/lead.service';
import { sendSuccess } from '../utils/apiResponse';

export class LeadController {
  public static createLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const lead = await LeadService.createLead(req.body, userId);
      sendSuccess(res, 201, 'Lead created successfully', { lead });
    } catch (error) {
      next(error);
    }
  };

  public static getLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, source, search, sort, page, limit } = req.query;

      const parsedPage = page ? parseInt(String(page), 10) : 1;
      const parsedLimit = limit ? parseInt(String(limit), 10) : 10;

      const result = await LeadService.getLeads({
        status: status ? String(status) : undefined,
        source: source ? String(source) : undefined,
        search: search ? String(search) : undefined,
        sort: sort === 'oldest' || sort === 'latest' ? sort : 'latest',
        page: parsedPage,
        limit: parsedLimit,
      });

      sendSuccess(res, 200, 'Leads retrieved successfully', result.leads, result.pagination);
    } catch (error) {
      next(error);
    }
  };

  public static getLeadById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const lead = await LeadService.getLeadById(id as string);
      sendSuccess(res, 200, 'Lead retrieved successfully', { lead });
    } catch (error) {
      next(error);
    }
  };

  public static updateLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const lead = await LeadService.updateLead(id as string, req.body);
      sendSuccess(res, 200, 'Lead updated successfully', { lead });
    } catch (error) {
      next(error);
    }
  };

  public static deleteLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await LeadService.deleteLead(id as string);
      sendSuccess(res, 200, 'Lead deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  public static exportCSV = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { status, source, search, sort } = req.query;

      const csvString = await LeadService.generateCSVString({
        status: status ? String(status) : undefined,
        source: source ? String(source) : undefined,
        search: search ? String(search) : undefined,
        sort: sort === 'oldest' ? 'oldest' : 'latest',
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="leads_export.csv"');
      res.status(200).send(csvString);
    } catch (error) {
      next(error);
    }
  };
}
export default LeadController;
