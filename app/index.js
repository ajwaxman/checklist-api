import express from 'express';
import { v4 as uuidv4 } from 'uuid';

import { router as api } from './api/v1/index.js';
import { logger, HTTPlogger } from './logger.js';

export const app = express();

// Parse JSON
app.use(express.json());

// Request ID
app.use((req, res, next) => {
  const id = uuidv4();
  req.id = id;
  res.setHeader('X-Request-ID', id);
  next();
});

// Setup router and routes
app.use('/api/v1', api);
app.use('/api', api);

// Log HTTP Requests
app.use(HTTPlogger);

// No route found handler
app.use((req, res, next) => {
  next({
    status: 404,
    message: `Error. Route not found: ${req.originalUrl}`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = '', error } = err;

  const data = {
    message,
    statusCode,
    error,
    tradeId: req.id,
  };

  if (statusCode < 500) {
    logger.warn(data);
  } else {
    logger.error(data);
  }

  res.status(statusCode);
  res.json(data);
});
