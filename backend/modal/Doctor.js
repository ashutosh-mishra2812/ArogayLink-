const mongoose = require("mongoose");

const hospitalInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  contactNumber: { type: String, default: "" },
});

const dailyTimeRangeSchema = new mongoose.Schema({
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
});

const availabilityRangeSchema = new mongoose.Schema({
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  dailySlots: { type: [dailyTimeRangeSchema], default: [] },
});

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },

    healthcareCategory: {
      type: String,
      enum: [
        "Primary Care",
        "Manage Your Condition",
        "Mental & Behavioral Health",
        "Sexual Health",
        "Children's Health",
        "Senior Health",
        "Women's Health",
        "Men's Health",
        "Wellness",
      ],
      trim: true,
    },

    specialization: {
      type: String,
      enum: [
        "Cardiologist",
        "Dermatologist",
        "Orthopedic",
        "Pediatrician",
        "Neurologist",
        "Gynecologist",
        "General Physician",
        "ENT Specialist",
        "Psychiatrist",
        "Ophthalmologist",
      ],
      trim: true,
    },

    qualification: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    about: { type: String, default: "" },
    hospitalInfo: hospitalInfoSchema,
    fees: { type: Number, default: 0 },

    availability: { type: [availabilityRangeSchema], default: [] },
    slotDuration: { type: Number, default: 30 },

    isVerify: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
