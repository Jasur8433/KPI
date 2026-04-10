import { Router } from 'express';
import { dashboardSummary } from '../controllers/dashboard.controller.js';
import { authRequired } from '../middleware/auth.js';

export const dashboardRouter = Router();
dashboardRouter.get('/summary', authRequired, dashboardSummary);
