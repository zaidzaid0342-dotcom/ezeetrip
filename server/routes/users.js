// server/routes/users.js
const express = require('express');
const router = express.Router();
const {
  getUser,
  updateUser,
  getUsers
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/profile')
  .get(protect, getUser)
  .put(protect, updateUser);

router
  .route('/')
  .get(protect, authorize('admin'), getUsers);

module.exports = router;