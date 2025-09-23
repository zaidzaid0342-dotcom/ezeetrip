// server/middleware/adminAuth.js
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');

// @desc    Check if user is admin
const adminAuth = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user || user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized as admin', 403));
  }

  next();
});

module.exports = adminAuth;