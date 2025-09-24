// server/app.js
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Fix Mongoose deprecation warning
mongoose.set('strictQuery', false);

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected ✅'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1); // Stop app if DB fails
});

const app = express();

// Body parser
app.use(express.json());

// Security middleware 🔒
app.use(helmet()); // Set secure headers
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks
app.use(hpp()); // Prevent HTTP param pollution

// Rate limiting (100 requests per 15 mins per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, try again later."
});
app.use(limiter);

// Enable CORS (only allow your frontend in production)
const allowedOrigins = [
  'http://localhost:3000',       // local dev frontend
  'https://ezeetrip.vercel.app'  // deployed frontend
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Route files
const auth = require('./routes/auth');
const packages = require('./routes/packages');
const bookings = require('./routes/bookings');
const users = require('./routes/users');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/packages', packages);
app.use('/api/bookings', bookings);
app.use('/api/users', users);

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
