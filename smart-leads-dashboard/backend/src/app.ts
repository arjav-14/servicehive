import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import routes from './routes';
import errorHandler from './middleware/error.middleware';
import ApiError from './utils/apiError';

const app = express();

// Enable Cross-Origin Resource Sharing with the frontend client
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

// Parse JSON and URL-encoded request payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome check
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'GigFlow - Smart Leads Dashboard Backend API is running.',
  });
});

// Register central routers
app.use('/api', routes);

// Catch-all for undefined route paths
app.use((req, _res, next) => {
  next(new ApiError(404, `API route not found: ${req.method} ${req.originalUrl}`));
});

// Apply centralized error handling middleware
app.use(errorHandler);

export default app;
