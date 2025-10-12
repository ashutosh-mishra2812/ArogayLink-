module.exports = (req, res, next) => {
  res.ok = (data = {}, message = 'Success', meta = {}) => res.json({ success: true, message, data, meta });
  res.serverError = (message = 'Server error', errors = []) => res.status(500).json({ success: false, message, errors });
  res.badRequest = (message = 'Bad request', errors = []) => res.status(400).json({ success: false, message, errors });
  res.notFound = (message = 'Not found') => res.status(404).json({ success: false, message });
  next();
};
