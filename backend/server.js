const express = require('express');
const mongoose = require('mongoose'); // Although imported, not used directly here, but kept for context.
const { connectDB } = require('./db/db');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const response = require('./middleware/response');
const moment = require('moment-timezone');

const app = express();

// Connect to MongoDB
connectDB();

// Security headers
app.use(helmet());

// HTTP request logging
app.use(morgan('dev'));

// Enable CORS
app.use(
  cors({
    origin:
      (process.env.ALLOWED_ORIGINS || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean) || '*',
    credentials: true,
  })
);

// Parse incoming JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Custom response middleware
app.use(response);

// ✅ Routes (Uncommented to make the application functional)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctor', require('./routes/doctor'));
app.use('/api/patient', require('./routes/patient'));

// Health check endpoint
app.get('/health', (req, res) => {
  const time = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
  res.ok({ time }, 'Server is healthy');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
