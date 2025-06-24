const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer');
const { storage } = require('../utlis/imageUploader'); // adjust path as needed
const upload = multer({ storage });


// Get user profile
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: error.message });
    }
});


// Update user profile
router.put('/update', verifyToken, upload.single('avatar'), async (req, res) => {
    try {
        const updates = req.body;

        if(req.file && req.file.path){
            updates.avatarUrl = req.file.path; // Update avatarUrl if a new file is uploaded
        }

        const updateUser = await User.findByIdAndUpdate(
            req.user,
            updates,
            {new: true}
        ).select("-password");
        if (!updateUser) {
            return res.status(404).json({ message: 'User not found' });
        } 
        res.status(200).json({ message: 'Profile updated successfully', user: updateUser });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/profile/public/:username
router.get("/public/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "name username email title bio contact socials avatarUrl"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
// This route handles user profile operations such as fetching and updating the user's profile.