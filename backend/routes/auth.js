const express = require("express");
const { body } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validate = require("../middleware/validate");
const Doctor = require("../modal/Doctor");
const Patient = require("../modal/Patient");
const { OAuth2Client } = require("google-auth-library");

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ JWT Token Generator
const signToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: "2d" });
};



// =======================================
// 🔹 DOCTOR REGISTER
// =======================================
router.post(
  "/doctor/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  async (req, res) => {
    try {
      const { name, email, password, specialization, healthcareCategory } = req.body;

      const exists = await Doctor.findOne({ email });
      if (exists) return res.status(400).json({ success: false, message: "Doctor already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const doctor = await Doctor.create({
        name,
        email,
        password: hashedPassword,
        specialization,
        healthcareCategory,
        isVerify: false,
      });

      const token = signToken(doctor._id, "doctor");

      return res.status(201).json({
        success: true,
        message: "Doctor registered successfully",
        data: { token, user: { id: doctor._id, type: "doctor" } },
      });
    } catch (error) {
      console.error("Doctor Register Error:", error.message);
      return res.status(500).json({ success: false, message: "Registration failed", error: error.message });
    }
  }
);


// =======================================
// 🔹 DOCTOR LOGIN (EMAIL / PASSWORD)
// =======================================
router.post(
  "/doctor/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // 1️⃣ Find doctor by email
      const doctor = await Doctor.findOne({ email });
      if (!doctor)
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });

      // 2️⃣ Check if the doctor has a password
      if (!doctor.password ) {
        return res.status(400).json({
          success: false,
          message: "Doctor registered via Google. Please login with Google.",
        });
      }

      // 3️⃣ Compare passwords
      const isMatch = await bcrypt.compare(password, doctor.password);
      if (!isMatch)
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });

      // 4️⃣ Generate JWT token
      const token = signToken(doctor._id, "doctor");

      return res.status(200).json({
        success: true,
        message: "Doctor login successful",
        data: { token, user: { id: doctor._id, type: "doctor" } },
      });
    } catch (error) {
      console.error("Doctor Login Error:", error);
      return res.status(500).json({
        success: false,
        message: "Login failed",
        error: error.message,
      });
    }
  }
);

// =======================================
// 🔹 DOCTOR GOOGLE SIGNUP/LOGIN
// =======================================
router.post("/doctor/google", async (req, res) => {
  try {
    const { tokenId } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    // 1️⃣ Find doctor by email
    let doctor = await Doctor.findOne({ email });

    // 2️⃣ If doctor does not exist, create a Google-only account
    if (!doctor) {
      doctor = await Doctor.create({
        name,
        email,
        registeredViaGoogle: true, // ✅ Flag for Google registration
        isVerify: true,
      });
    }

    // 3️⃣ If doctor exists but is normal account, you may link Google (optional)
    else if (!doctor.registeredViaGoogle) {
      doctor.registeredViaGoogle = true;
      await doctor.save();
    }

    // 4️⃣ Generate JWT token
    const token = signToken(doctor._id, "doctor");

    return res.status(200).json({
      success: true,
      message: "Google login successful (doctor)",
      data: { token, user: { id: doctor._id, type: "doctor" } },
    });
  } catch (error) {
    console.error("Doctor Google Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Google login failed",
      error: error.message,
    });
  }
});


// =======================================
// 🔹 PATIENT REGISTER
// =======================================
router.post(
  "/patient/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  async (req, res) => {
    try {
      const { name, email, password, age, gender } = req.body;

      const exists = await Patient.findOne({ email });
      if (exists) return res.status(400).json({ success: false, message: "Patient already exists" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const patient = await Patient.create({
        name,
        email,
        password: hashedPassword,
        age,
        gender,
        isVerify: false,
      });

      const token = signToken(patient._id, "patient");

      return res.status(201).json({
        success: true,
        message: "Patient registered successfully",
        data: { token, user: { id: patient._id, type: "patient" } },
      });
    } catch (error) {
      console.error("Patient Register Error:", error.message);
      return res.status(500).json({ success: false, message: "Registration failed", error: error.message });
    }
  }
);


// =======================================
// 🔹 PATIENT LOGIN
// =======================================
router.post(
  "/patient/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const patient = await Patient.findOne({ email });
      if (!patient) return res.status(400).json({ success: false, message: "Invalid email or password" });

      const isMatch = await bcrypt.compare(password, patient.password);
      if (!isMatch) return res.status(400).json({ success: false, message: "Invalid email or password" });

      const token = signToken(patient._id, "patient");

      return res.status(200).json({
        success: true,
        message: "Patient login successful",
        data: { token, user: { id: patient._id, type: "patient" } },
      });
    } catch (error) {
      console.error("Patient Login Error:", error.message);
      return res.status(500).json({ success: false, message: "Login failed", error: error.message });
    }
  }
);


// =======================================
// 🔹 PATIENT GOOGLE SIGNUP/LOGIN
// =======================================
router.post("/patient/google", async (req, res) => {
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
        password: "",
        isVerify: true,
      });
    }

    const token = signToken(patient._id, "patient");

    return res.status(200).json({
      success: true,
      message: "Google login successful (patient)",
      data: { token, user: { id: patient._id, type: "patient" } },
    });
  } catch (error) {
    console.error("Patient Google Login Error:", error.message);
    return res.status(500).json({ success: false, message: "Google login failed", error: error.message });
  }
});



module.exports = router;
