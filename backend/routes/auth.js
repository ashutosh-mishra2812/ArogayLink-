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
// DOCTOR REGISTER
// =======================================
router.post(
  '/doctor/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  async (req, res) => {
    try {
      const { name, email, password, specialization, healthcareCategory } = req.body;

      if (await Doctor.findOne({ email })) {
        return res.badRequest('Doctor already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const doctor = await Doctor.create({
        name,
        email,
        password: hashedPassword,
        specialization,
        healthcareCategory,
        isVerify: false,
      });

      const token = signToken(doctor._id, 'doctor');
      return res.created({ token, user: { id: doctor._id, type: 'doctor' } }, 'Doctor registered successfully');
    } catch (error) {
      console.error('Doctor Register Error:', error.message);
      return res.serverError('Registration failed', { error: error.message });
    }
  }
);

// DOCTOR LOGIN
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
      if (!doctor) return res.badRequest('Invalid email or password');

      if (!doctor.password) return res.badRequest('Login via Google');

      const isMatch = await bcrypt.compare(password, doctor.password);
      if (!isMatch) return res.badRequest('Invalid email or password');

      const token = signToken(doctor._id, 'doctor');
      return res.ok({ token, user: { id: doctor._id, type: 'doctor' } }, 'Doctor login successful');
    } catch (error) {
      console.error('Doctor Login Error:', error.message);
      return res.serverError('Login failed', { error: error.message });
    }
  }
);

// DOCTOR GOOGLE LOGIN/SIGNUP
router.post('/doctor/google', async (req, res) => {
  try {
    const { tokenId } = req.body;
    const ticket = await client.verifyIdToken({ idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID });
    const { email, name } = ticket.getPayload();

    let doctor = await Doctor.findOne({ email });
    if (!doctor) doctor = await Doctor.create({ name, email, registeredViaGoogle: true, isVerify: true });
    else if (!doctor.registeredViaGoogle) { doctor.registeredViaGoogle = true; await doctor.save(); }

    const token = signToken(doctor._id, 'doctor');
    return res.ok({ token, user: { id: doctor._id, type: 'doctor' } }, 'Google login successful (doctor)');
  } catch (error) {
    console.error('Doctor Google Login Error:', error.message);
    return res.serverError('Google login failed', { error: error.message });
  }
});

// PATIENT REGISTER
router.post(
  '/patient/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validate,
  async (req, res) => {
    try {
      const { name, email, password, age, gender } = req.body;

      if (await Patient.findOne({ email })) return res.badRequest('Patient already exists');

      const hashedPassword = await bcrypt.hash(password, 10);

      const patient = await Patient.create({ name, email, password: hashedPassword, age, gender, isVerify: false });
      const token = signToken(patient._id, 'patient');

      return res.created({ token, user: { id: patient._id, type: 'patient' } }, 'Patient registered successfully');
    } catch (error) {
      console.error('Patient Register Error:', error.message);
      return res.serverError('Registration failed', { error: error.message });
    }
  }
);

// PATIENT LOGIN
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
      if (!patient) return res.badRequest('Invalid email or password');

      const isMatch = await bcrypt.compare(password, patient.password);
      if (!isMatch) return res.badRequest('Invalid email or password');

      const token = signToken(patient._id, 'patient');
      return res.ok({ token, user: { id: patient._id, type: 'patient' } }, 'Patient login successful');
    } catch (error) {
      console.error('Patient Login Error:', error.message);
      return res.serverError('Login failed', { error: error.message });
    }
  }
);

// PATIENT GOOGLE LOGIN/SIGNUP
router.post('/patient/google', async (req, res) => {
  try {
    const { tokenId } = req.body;
    const ticket = await client.verifyIdToken({ idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID });
    const { email, name } = ticket.getPayload();

    let patient = await Patient.findOne({ email });
    if (!patient) patient = await Patient.create({ name, email, password: '', isVerify: true });

    const token = signToken(patient._id, 'patient');
    return res.ok({ token, user: { id: patient._id, type: 'patient' } }, 'Google login successful (patient)');
  } catch (error) {
    console.error('Patient Google Login Error:', error.message);
    return res.serverError('Google login failed', { error: error.message });
  }
});

module.exports = router;
