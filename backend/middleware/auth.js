const jwt = require('jsonwebtoken');
const Doctor = require('../modal/Doctor');
const Patient = require('../modal/Patient');

module.exports = {
  // ✅ Middleware to verify JWT and fetch user
  authenticate: async (req, res, next) => {
    try {
      const header = req.headers.authorization;

      // Check header presence
      if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Token missing' });
      }

      // Extract token
      const token = header.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.auth = decoded;

      // Fetch user based on role type
      let user;
      if (decoded.type === 'doctor') {
        user = await Doctor.findById(decoded.id);
      } else if (decoded.type === 'patient') {
        user = await Patient.findById(decoded.id);
      }

      // If user not found
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid user' });
      }

      // Attach user
      req.user = user;
      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  },

  // ✅ Middleware to restrict route based on role
  requireRole: (role) => (req, res, next) => {
    if (!req.auth || req.auth.type !== role) {
      return res.status(403).json({ success: false, message: 'Insufficient role permissions' });
    }
    next();
  },
};
