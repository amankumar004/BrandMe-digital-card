const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Otp = require('../models/otp');
const sendOtpEmail = require('../utlis/sendOtp');
require('dotenv').config();

// sending OTP for email verification
router.post('/send-otp', async (req, res) => {
    try {
        const {email} = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const otp = Math.floor(100000 + Math.random()*900000).toString(); // Generate a 6-digit OTP
        await Otp.create({email, otp});

        await sendOtpEmail(email, otp);
        res.status(200).json({ message: 'OTP sent to your email' });
    }
    catch(error){
        console.log('Error in sending OTP:', error);
        res.status(500).json({ error: "Failed to send OTP" });
    }
})


// Register route
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, username, otp} = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const existingOtp = await Otp.findOne({email}).sort({createdAt: -1});
        if (!existingOtp || existingOtp.otp !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            name,
            email,
            username,
            password: hashedPassword
        })

        // Delete the OTP after successful registration
        await Otp.deleteMany({email});

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        res.status(201).json({token, username: newUser.username, message: 'User registered successfully'});
    } catch(error){
        console.log('Error in signup:', error);
        res.status(500).json({ error: error.message });
    }
})

// Login route
router.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;
        // Check if user exists
        const user = await User.findOne({email});
        if(!user){ 
            return res.status(400).json({message: 'User not found'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentials'});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        res.status(200).json({token, user, message: 'Login successful'});
    } catch(error){
        console.log('Error in login:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found with this email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.create({ email, otp });

    await sendOtpEmail(email, otp);
    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error in forgot-password/send-otp:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

router.post('/forgot-password/reset', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const validOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!validOtp || validOtp.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    await Otp.deleteMany({ email });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error in forgot-password/reset:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});


// Check username availability
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ available: false, message: 'Username already taken' });
    } else {
      return res.status(200).json({ available: true, message: 'Username is available' });
    }
  } catch (error) {
    console.error('Error checking username:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;