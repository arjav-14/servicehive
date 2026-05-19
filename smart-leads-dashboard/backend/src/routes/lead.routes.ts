import { Router } from 'express';
import LeadController from '../controllers/lead.controller';
import authenticate from '../middleware/auth.middleware';
import authorize from '../middleware/role.middleware';
import validateRequest from '../middleware/validate.middleware';
import { createLeadSchema, updateLeadSchema } from '../validations/lead.validation';

const router = Router();

// Secure all endpoints under /api/leads
router.use(authenticate);

// CSV Export Route
router.get('/export', LeadController.exportCSV);

// Lead CRUD
router.post('/', validateRequest(createLeadSchema), LeadController.createLead);
router.get('/', LeadController.getLeads);
router.get('/:id', LeadController.getLeadById);
router.put('/:id', validateRequest(updateLeadSchema), LeadController.updateLead);

// DELETE Lead - Strictly Admin-only RBAC protection
router.delete('/:id', authorize('admin'), LeadController.deleteLead);

export default router;
