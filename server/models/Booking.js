// server/models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  package: {
    type: mongoose.Schema.ObjectId,
    ref: 'Package',
    required: true
  },
  orderId: {  // Add orderId field
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  startDate: {
    type: Date,
    required: function() {
      const packageType = this.package.type;
      return packageType === 'travel' || packageType === 'resort';
    }
  },
  
  adults: {
    type: Number,
    required: true,
    min: [1, 'Number of adults must be at least 1']
  },
  children: {
    type: Number,
    default: 0,
    min: [0, 'Number of children cannot be negative']
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed','paid', 'cancelled'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', BookingSchema);