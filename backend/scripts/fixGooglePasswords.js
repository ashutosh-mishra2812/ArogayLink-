require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Doctor = require('../modal/Doctor'); // adjust path

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to DB");

    const doctor = await Doctor.findOne({ email: "ashu@doctur.com" });
    if (!doctor) {
      console.log("❌ Doctor not found");
      return process.exit(1);
    }

    const hashedPassword = await bcrypt.hash("123456", 10);
    doctor.password = hashedPassword;
    await doctor.save();

    console.log("✅ Password added successfully for:", doctor.email);
    process.exit(0);
  })
  .catch(err => console.error(err));
