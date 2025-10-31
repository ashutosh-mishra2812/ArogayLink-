require('dotenv').config();
const express = require('express');
const { connectDB } = require('./db/db');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const response = require('./middleware/response');
const moment = require('moment-timezone');
const path = require ('path')

const app = express();

// Connect to MongoDB
connectDB();

// Security headers
app.use(helmet());

// HTTP request logging
app.use(morgan('dev'));

// Parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = allowedOriginsEnv
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true,
}));

// Custom response helpers: res.ok, res.created, etc.
app.use(cookieParser());
app.use(passport.initialize());
app.use(response);

// Load passport strategy
// require('./passport');


// Routes
// app.use('/api/auth', require('./routes/googleAuth'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctor', require('./routes/doctor'));
app.use('/api/patient', require('./routes/patient'));

// Health check
app.get('/health', (req, res) => {
  const time = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
  res.ok({ time }, 'Server is healthy');
});

// 404 handler: Always return JSON
app.use((req, res) => {
  res.notFound('Route not found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) return next(err);
  res.serverError('Internal server error', { message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
