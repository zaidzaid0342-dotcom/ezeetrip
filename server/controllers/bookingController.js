// server/controllers/bookingController.js
const Booking = require('../models/Booking');
const Package = require('../models/Package');

// Helper function to generate a unique 4-digit order ID
const generateOrderId = async () => {
  let orderId;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate a random 4-digit number (1000-9999)
    orderId = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Check if the orderId is unique
    const existingBooking = await Booking.findOne({ orderId });
    
    if (!existingBooking) {
      isUnique = true;
    }
  }
  
  return orderId;
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
  try {
    let query;
    
    // If user is not admin, they can only see their own bookings
    if (req.user.role !== 'admin') {
      query = Booking.find({ user: req.user.id });
    } else {
      query = Booking.find();
    }
    
    const bookings = await query.populate({
      path: 'package',
      select: 'name type price'
    }).populate({
      path: 'user',
      select: 'name email'
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: 'package',
      select: 'name type price location duration meals'
    }).populate({
      path: 'user',
      select: 'name email'
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: `Booking not found with id of ${req.params.id}` });
    }

    // Make sure user is booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: `Not authorized to access this booking` });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    
    // Log the incoming request body for debugging
    console.log('Booking request body:', req.body);
    
    // Generate a unique 4-digit order ID
    const orderId = await generateOrderId();
    req.body.orderId = orderId;
    
    // Get package
    const pkg = await Package.findById(req.body.package);
    
    if (!pkg) {
      return res.status(404).json({ success: false, message: `Package not found with id of ${req.body.package}` });
    }
    
    // Calculate total price
    const adultPrice = pkg.price;
    const childPrice = pkg.price / 2;
    const adults = req.body.adults || 1;
    const children = req.body.children || 0;
    const totalPrice = (adults * adultPrice) + (children * childPrice);
    
    // Create booking
    const bookingData = {
      ...req.body,
      totalPrice
    };
    
    // Log the booking data before saving
    console.log('Creating booking with data:', bookingData);
    
    const booking = await Booking.create(bookingData);
    
    // Log the created booking
    console.log('Created booking:', booking);

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: `Booking not found with id of ${req.params.id}` });
    }

    // Make sure user is booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: `Not authorized to update this booking` });
    }

    // If package or number of people is updated, recalculate total price
    if (req.body.package || req.body.adults || req.body.children) {
      const pkg = await Package.findById(req.body.package || booking.package);
      const adults = req.body.adults || booking.adults;
      const children = req.body.children || booking.children;
      req.body.totalPrice = (adults * pkg.price) + (children * (pkg.price / 2));
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate({
      path: 'package',
      select: 'name type price'
    }).populate({
      path: 'user',
      select: 'name email'
    });

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: `Booking not found with id of ${req.params.id}` });
    }

    // Make sure user is booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: `Not authorized to delete this booking` });
    }

    await booking.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: 'package',
      select: 'name type price'
    }).populate({
      path: 'user',
      select: 'name email'
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: `Booking not found with id of ${req.params.id}` });
    }

    booking.status = req.body.status;
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(400).json({ success: false, message: err.message });
  }
};