// server/models/Package.js
const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a package name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    required: [true, 'Please specify the package type'],
    enum: ['travel', 'food', 'resort']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price must be a positive number']
  },
  duration: {
    type: String,
    required: function() {
      return this.type === 'travel' || this.type === 'resort';
    }
  },
  location: {
    type: String,
    required: function() {
      return this.type === 'travel' || this.type === 'resort';
    }
  },
  meals: {
    type: String,
    required: function() {
      return this.type === 'food' || this.type === 'resort';
    }
  },
  images: {
    type: [String],
    default: []
  },
  available: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Package', PackageSchema);