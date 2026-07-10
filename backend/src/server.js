import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// When running behind a proxy (Render, Vercel), enable trust proxy so
// express-rate-limit and other middleware can correctly read client IPs.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  console.log('Express trust proxy enabled');
}

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
const configuredFrontend = process.env.FRONTEND_URL || 'https://student-notes-sharing-1.onrender.com';
console.log('Configured FRONTEND_URL:', configuredFrontend);

const allowedOrigins = [
  configuredFrontend,
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn('Blocked CORS origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
app.use(generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend static files when available (single Render service)
try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');

  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get(/^\/(?!api).*/, (req, res) => {
      res.sendFile(path.join(frontendDist, 'index.html'));
    });
  }
} catch (err) {
  // If anything goes wrong while resolving paths, continue without serving static files
  console.warn('Frontend static serving disabled:', err.message);
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

const startServer = async () => {
  try {
    await connectDatabase();
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

export default app;
