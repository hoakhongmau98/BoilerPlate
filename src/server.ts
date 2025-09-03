/* eslint-disable import/first */
require('module-alias/register');
import 'reflect-metadata';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import session from 'express-session';
import cors from 'cors';
import sequelize from '@initializers/sequelize';
import strongParams from '@middlewares/parameters';
import { morganLogger } from '@middlewares/morgan';
import routes from '@configs/routes';
import Settings from '@configs/settings';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/doc';

const port = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({
  extended: true,
  limit: '10mb',
}));

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Session configuration
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: Settings.sessionSecret,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));

// NOTE: Express v5 no longer supports '*' path patterns with path-to-regexp.
// Preflight requests are handled by the CORS middleware above.
// If you need explicit OPTIONS handling, use a safe pattern like '/api/(.*)'.

// Logging middleware
app.use(morganLogger());

// Parameters middleware
app.use(strongParams());

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.path} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', error);

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message,
    timestamp: new Date().toISOString(),
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    const shouldSkipDbAuth = String(process.env.SKIP_DB_AUTH || '').toLowerCase() === 'true';
    if (shouldSkipDbAuth) {
      console.warn('SKIP_DB_AUTH is enabled. Skipping database authentication for local/dev bring-up.');
    } else {
      // Test database connection
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');
    }

    // Start the server
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
      console.log(`📚 API Documentation available at http://localhost:${port}/api-docs`);
      console.log(`🏥 Health check available at http://localhost:${port}/health`);
      console.log('  Press CTRL-C to stop\n');
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
