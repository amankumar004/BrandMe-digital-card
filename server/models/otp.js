const mongoose = require('mongoose');

// OTP Schema for storing one-time passwords
const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '10m' } // OTP expires after 10 minutes
});

module.exports = mongoose.model('Otp', otpSchema);
// This model defines the structure of an OTP document in MongoDB using Mongoose.