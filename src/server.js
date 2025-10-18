require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' })); // CORS
app.use(compression()); // Compression
app.use(morgan('dev')); // Logging
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true })); // URL encoded parser

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 3600000, // 1 hour
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Rate limit exceeded. Please try again later.',
      },
    });
  },
});

app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// API Routes
const API_VERSION = process.env.API_VERSION || 'v1';
app.use(`/api/${API_VERSION}/auth`, require('./routes/authRoutes'));
app.use(`/api/${API_VERSION}/users`, require('./routes/userRoutes'));
app.use(`/api/${API_VERSION}/schools`, require('./routes/schoolRoutes'));
app.use(`/api/${API_VERSION}/classrooms`, require('./routes/classroomRoutes'));
app.use(`/api/${API_VERSION}/children`, require('./routes/childRoutes'));
app.use(`/api/${API_VERSION}/attendance`, require('./routes/attendanceRoutes'));
app.use(`/api/${API_VERSION}/activities`, require('./routes/activityRoutes'));
app.use(`/api/${API_VERSION}/conversations`, require('./routes/conversationRoutes'));
app.use(`/api/${API_VERSION}/messages`, require('./routes/messageRoutes'));
app.use(`/api/${API_VERSION}/invoices`, require('./routes/invoiceRoutes'));
app.use(`/api/${API_VERSION}/payments`, require('./routes/paymentRoutes'));
app.use(`/api/${API_VERSION}/learning-activities`, require('./routes/learningActivityRoutes'));
app.use(`/api/${API_VERSION}/assessments`, require('./routes/assessmentRoutes'));
app.use(`/api/${API_VERSION}/reports`, require('./routes/reportRoutes'));
app.use(`/api/${API_VERSION}/notifications`, require('./routes/notificationRoutes'));
app.use(`/api/${API_VERSION}/events`, require('./routes/eventRoutes'));
app.use(`/api/${API_VERSION}/upload`, require('./routes/uploadRoutes'));

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;

