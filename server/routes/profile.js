const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Update user profile details
router.put('/', auth, async (req, res) => {
  try {
    const { fullName, phone, addressLine1, addressLine2, city, state, pincode } = req.body;

    if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({ error: "All required fields (*) must be completed." });
    }

    if (phone.length !== 10 || isNaN(phone)) {
      return res.status(400).json({ error: "Invalid phone: must be a 10-digit number." });
    }

    if (pincode.length !== 6 || isNaN(pincode)) {
      return res.status(400).json({ error: "Invalid pincode: must be a 6-digit number." });
    }

    const users = await db.getUsers();
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User profile not found." });
    }

    // Update user properties
    user.name = fullName;
    user.phone = phone;
    user.address = addressLine1; // keep legacy address field synced
    user.addressLine1 = addressLine1;
    user.addressLine2 = addressLine2 || '';
    user.city = city;
    user.state = state;
    user.pincode = pincode;

    await db.saveUser(user);

    // Exclude password in response
    const { password: _, ...updatedUser } = user;

    res.json({
      message: "Profile configuration updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error("Profile PUT Update Error:", err);
    res.status(500).json({ error: "Failed to update profile settings" });
  }
});

module.exports = router;
