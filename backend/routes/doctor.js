const express = require('express');
const { query, body } = require('express-validator');
const Doctor = require('../models/Doctor'); // ✅ Corrected path
const { authenticate, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// 🩺 Get list of doctors
router.get(
  '/list',
  [
    query('search').optional().isString(), // ✅ Typo fixed
    query('specialization').optional().isString(),
    query('city').optional().isString(),
    query('category').optional().isString(),
    query('minFees').optional().isInt({ min: 0 }),
    query('maxFees').optional().isInt({ min: 0 }),
    query('sortBy').optional().isIn(['fees', 'experience', 'name', 'createdAt']),
    query('sortOrder').optional().isIn(['asc', 'desc']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  async (req, res) => {
    try {
      const {
        search,
        specialization,
        city,
        category,
        minFees,
        maxFees,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 20,
      } = req.query;

      const filter = { isVerified: true };

      if (specialization)
        filter.specialization = { $regex: `^${specialization}$`, $options: 'i' };

      if (city) filter['hospitalInfo.city'] = { $regex: `^${city}$`, $options: 'i' };
      if (category) filter.category = category;

      if (minFees || maxFees) {
        filter.fees = {};
        if (minFees) filter.fees.$gte = Number(minFees);
        if (maxFees) filter.fees.$lte = Number(maxFees);
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { specialization: { $regex: search, $options: 'i' } },
          { 'hospitalInfo.name': { $regex: search, $options: 'i' } },
        ];
      }

      const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
      const skip = (Number(page) - 1) * Number(limit);

      const [items, total] = await Promise.all([
        Doctor.find(filter)
          .select('-password -googleId')
          .sort(sort)
          .skip(skip)
          .limit(Number(limit)),
        Doctor.countDocuments(filter),
      ]);

      res.status(200).json({
        success: true,
        message: 'Doctors fetched successfully',
        data: items,
        pagination: { page: Number(page), limit: Number(limit), total },
      });
    } catch (error) {
      console.error('Doctor fetch failed:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch doctors',
        error: error.message,
      });
    }
  }
);

// 🧑‍⚕️ Get the profile of logged-in doctor
router.get('/me', authenticate, requireRole('doctor'), async (req, res) => {
  try {
    const doc = await Doctor.findById(req.user._id).select('-password -googleId');
    if (!doc)
      return res.status(404).json({ success: false, message: 'Doctor not found' });

    res.status(200).json({
      success: true,
      message: 'Profile fetched successfully',
      data: doc,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// 📝 Update doctor profile
router.put(
  '/onboarding/update',
  authenticate,
  requireRole('doctor'),
  [
    body('name').optional().notEmpty(),
    body('specialization').optional().notEmpty(),
    body('qualification').optional().notEmpty(),
    body('category').optional().notEmpty(),
    body('about').optional().isString(),
    body('fees').optional().isInt({ min: 0 }),
    body('availability').optional().isArray(),
    body('availability.*.fromDate').optional().isISO8601(),
    body('availability.*.toDate').optional().isISO8601(),
    body('availability.*.dailySlots').optional().isArray(),
    body('availability.*.dailySlots.*.day').optional().isString(),
    body('availability.*.dailySlots.*.startTime').optional().isString(),
    body('availability.*.dailySlots.*.endTime').optional().isString(),
    body('experience').optional().isInt({ min: 0 }),
    body('hospitalInfo').optional().isObject(),
    body('slotDurationMinutes').optional().isInt({ min: 5, max: 180 }),
  ],
  validate,
  async (req, res) => {
    try {
      const updates = { ...req.body };
      delete updates.password;
      updates.isVerified = true; // ✅ fixed variable name

      const doc = await Doctor.findByIdAndUpdate(req.user._id, updates, {
        new: true,
      }).select('-password -googleId');

      if (!doc)
        return res.status(404).json({ success: false, message: 'Doctor not found' });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: doc,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Profile update failed',
        error: error.message,
      });
    }
  }
);

module.exports = router;

