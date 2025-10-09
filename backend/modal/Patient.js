const mongoose = require("mongoose");
const { computeAgeFromDob } = require("../utils/date");


const medicalHistorySchema = new mongoose.Schema(
  {
    allergies: { type: String, default: "" },
    currentMedications: { type: String, default: "" },
    chronicConditions: { type: String, default: "" },
    surgeries: { type: String, default: "" },
    familyHistory: { type: String, default: "" },
  },
  { _id: false }
);



const emergencyContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String },
  },
  { _id: false }
);


const patientSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phone: { type: String },

    dob: { type: Date },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
    },

    age: { type: Number },

    address: { type: String },

    profileImage: { type: String }, 

    medicalHistory: medicalHistorySchema,

    emergencyContact: emergencyContactSchema,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, 
  }
);


patientSchema.pre("save", function (next) {
  if (this.dob) {
    this.age = computeAgeFromDob(this.dob);
  }
  next();
});


module.exports = mongoose.model("Patient", patientSchema);
