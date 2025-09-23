// server/routes/bookings.js
const express = require('express');
const router = express.Router();
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatus
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, getBookings)
  .post(protect, createBooking);

router
  .route('/:id')
  .get(protect, getBooking)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);

router
  .route('/:id/status')
  .put(protect, updateBookingStatus);

module.exports = router;