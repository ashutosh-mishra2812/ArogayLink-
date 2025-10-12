// middleware/validate.js
const { validationResult } = require('express-validator');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If response helpers present, use them
    if (res && typeof res.badRequest === 'function') {
      return res.badRequest('Validation failed', errors.array());
    }
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};
