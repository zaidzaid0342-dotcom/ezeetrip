// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Fix Mongoose deprecation warning
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;