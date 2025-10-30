const express = require('express');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validate = require('../middleware/validate');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: JWT token generator
const signToken = (id, type) =>
  jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: '2d' });

// =======================================
// ✅ DOCTOR REGISTER
// =======================================
router.post(
  '/doctor/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validate,
  async (req, res) => {
    try {
      const { name, email, password, specialization, healthcareCategory } = req.body;

      // Check if doctor exists
      const existingDoctor = await Doctor.findOne({ email });
      if (existingDoctor) {
        return res.status(400).json({
          success: false,
          message: 'Doctor already exists',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create doctor
      const doctor = await Doctor.create({
        name,
        email,
        password: hashedPassword,
        specialization,
        healthcareCategory,
        isVerify: false,
      });

      // Generate JWT
      const token = signToken(doctor._id, 'doctor');

      // Success response
      return res.status(201).json({
        success: true,
        message: 'Doctor registered successfully',
        token,
        user: {
          id: doctor._id,
          type: 'doctor',
        },
      });
    } catch (error) {
      console.error('Doctor Register Error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message,
      });
    }
  }
);

// =======================================
// ✅ DOCTOR LOGIN
// =======================================
router.post(
  '/doctor/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const doctor = await Doctor.findOne({ email });
      if (!doctor)
        return res.status(400).json({
          success: false,
          message: 'Invalid email or password',
        });

      if (!doctor.password)
        return res.status(400).json({
          success: false,
          message: 'Login via Google',
        });

      const isMatch = await bcrypt.compare(password, doctor.password);
      if (!isMatch)
        return res.status(400).json({
          success: false,
          message: 'Invalid email or password',
        });

      const token = signToken(doctor._id, 'doctor');

      return res.status(200).json({
        success: true,
        message: 'Doctor login successful',
        token,
        user: {
          id: doctor._id,
          type: 'doctor',
        },
      });
    } catch (error) {
      console.error('Doctor Login Error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message,
      });
    }
  }
);

// =======================================
// ✅ DOCTOR GOOGLE LOGIN/SIGNUP
// =======================================
router.post('/doctor/google', async (req, res) => {
  try {
    const { tokenId } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let doctor = await Doctor.findOne({ email });
    if (!doctor) {
      doctor = await Doctor.create({
        name,
        email,
        registeredViaGoogle: true,
        isVerify: true,
      });
    } else if (!doctor.registeredViaGoogle) {
      doctor.registeredViaGoogle = true;
      await doctor.save();
    }

    const token = signToken(doctor._id, 'doctor');

    return res.status(200).json({
      success: true,
      message: 'Google login successful (doctor)',
      token,
      user: {
        id: doctor._id,
        type: 'doctor',
      },
    });
  } catch (error) {
    console.error('Doctor Google Login Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Google login failed',
      error: error.message,
    });
  }
});

// =======================================
// ✅ PATIENT REGISTER
// =======================================
router.post(
  '/patient/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validate,
  async (req, res) => {
    try {
      const { name, email, password, age, gender } = req.body;

      const existingPatient = await Patient.findOne({ email });
      if (existingPatient) {
        return res.status(400).json({
          success: false,
          message: 'Patient already exists',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const patient = await Patient.create({
        name,
        email,
        password: hashedPassword,
        age,
        gender,
        isVerify: false,
      });

      const token = signToken(patient._id, 'patient');

      return res.status(201).json({
        success: true,
        message: 'Patient registered successfully',
        token,
        user: {
          id: patient._id,
          type: 'patient',
        },
      });
    } catch (error) {
      console.error('Patient Register Error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message,
      });
    }
  }
);

// =======================================
// ✅ PATIENT LOGIN
// =======================================
router.post(
  '/patient/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const patient = await Patient.findOne({ email });

      if (!patient)
        return res.status(400).json({
          success: false,
          message: 'Invalid email or password',
        });

      const isMatch = await bcrypt.compare(password, patient.password);
      if (!isMatch)
        return res.status(400).json({
          success: false,
          message: 'Invalid email or password',
        });

      const token = signToken(patient._id, 'patient');
      console.log("Generated Token:", token);

      return res.status(200).json({
        success: true,
        message: 'Patient login successful',
        token,
        user: {
          id: patient._id,
          type: 'patient',
        },
      });
    } catch (error) {
      console.error('Patient Login Error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message,
      });
    }
  }
);

// =======================================
// ✅ PATIENT GOOGLE LOGIN/SIGNUP
// =======================================
router.post('/patient/google', async (req, res) => {
  try {
    const { tokenId } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let patient = await Patient.findOne({ email });
    if (!patient) {
      patient = await Patient.create({
        name,
        email,
        password: '',
        isVerify: true,
      });
    }

    const token = signToken(patient._id, 'patient');

    return res.status(200).json({
      success: true,
      message: 'Google login successful (patient)',
      token,
      user: {
        id: patient._id,
        type: 'patient',
      },
    });
  } catch (error) {
    console.error('Patient Google Login Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Google login failed',
      error: error.message,
    });
  }
});

module.exports = router;
