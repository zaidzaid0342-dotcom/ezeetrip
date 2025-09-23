// server/routes/admin.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.use(protect);
router.use(adminAuth);

// Admin routes here
router.get('/dashboard', (req, res) => {
  res.status(200).json({ success: true, data: 'Admin dashboard' });
});

module.exports = router;