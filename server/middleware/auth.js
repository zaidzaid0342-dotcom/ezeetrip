// server/middleware/auth.js (Fixed)
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
   // console.log('No token provided');
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //  console.log('Decoded token:', decoded);

    // Get user from the token
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      //console.log('User not found');
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    console.log('User found:', req.user);
    next();
  } catch (err) {
   // console.error('Token verification error:', err);
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
     // console.log('No user found in request');
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
    
    //console.log('User role:', req.user.role);
    //console.log('Required roles:', roles);
    
    if (!roles.includes(req.user.role)) {
     // console.log('User role not authorized');
      return res.status(403).json({ 
        success: false, 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};