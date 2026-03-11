import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { analysisRoutes } from './routes/analysis.routes';
import { errorHandler } from './middlewares/errorHandler';

// ─── Validar variables de entorno críticas ─────────────────────────────────
const PORT = process.env.PORT || 3002;
const isDev = process.env.NODE_ENV !== 'production';
const FRONTEND_URL = process.env.FRONTEND_URL || (isDev ? 'http://localhost:5174' : undefined);

if (!FRONTEND_URL && !isDev) {
  console.error('FRONTEND_URL no configurada en producción');
  process.exit(1);
}

const app = express();

// ─── Middlewares ─────────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    }
  }
}));
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type']
}));
app.use(express.json({ limit: '2mb' })); // FIX: 10mb → 2mb (DoS prevention)
app.use(morgan(isDev ? 'dev' : 'combined'));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Demasiadas solicitudes. Intenta en 15 minutos.' }
}));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({
  status: 'ok',
  service: 'aguaflow-api',
  version: '1.0.0',
  timestamp: new Date().toISOString()
}));
app.use('/api/analysis', analysisRoutes);

// ─── Error handler (SIEMPRE al final) ────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`💧 AguaFlow API running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
});

export default app;
