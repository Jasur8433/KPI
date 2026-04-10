import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { createKpi, listKpi, reviewKpi, submitKpi } from '../controllers/kpi.controller.js';

export const kpiRouter = Router();

kpiRouter.get('/', authRequired, listKpi);
kpiRouter.post('/', authRequired, createKpi);
kpiRouter.post('/input', authRequired, submitKpi);
kpiRouter.patch('/submissions/:id/review', authRequired, reviewKpi);
