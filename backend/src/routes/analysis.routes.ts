import { Router } from 'express';
import { analysisController } from '../controllers/analysis.controller';

export const analysisRoutes = Router();

analysisRoutes.post('/companies', analysisController.createCompany);
analysisRoutes.post('/start', analysisController.startAnalysis);
analysisRoutes.post('/quick', analysisController.quickAnalysis);
analysisRoutes.get('/', analysisController.listAnalyses);
analysisRoutes.get('/:id', analysisController.getAnalysis);
