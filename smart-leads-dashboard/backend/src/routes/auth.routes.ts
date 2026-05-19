import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import validateRequest from '../middleware/validate.middleware';
import { registerSchema, loginSchema } from '../validations/auth.validation';
import authenticate from '../middleware/auth.middleware';

const router = Router();

router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.get('/profile', authenticate, AuthController.getProfile);

export default router;
