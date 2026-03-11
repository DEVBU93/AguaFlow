import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { analysisRoutes } from './routes/analysis.routes';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5174', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Demasiadas solicitudes' }));

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'aguaflow-api', version: '1.0.0' }));
app.use('/api/analysis', analysisRoutes);

app.listen(PORT, () => {
  console.log(`🌊 AguaFlow API running on port ${PORT}`);
});

export default app;
