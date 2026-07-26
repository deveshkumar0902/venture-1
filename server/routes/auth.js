const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_cyberpunk_token_hash_key';

// 1. Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, address, pincode, password } = req.body;

    if (!name || !email || !phone || !address || !pincode || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (phone.length !== 10 || isNaN(phone)) {
      return res.status(400).json({ error: "Invalid phone: must be a 10-digit number." });
    }

    if (pincode.length !== 6 || isNaN(pincode)) {
      return res.status(400).json({ error: "Invalid pincode: must be a 6-digit number." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const users = await db.getUsers();
    
    // Check duplicates
    const isDuplicate = users.some(u => 
      u.email.toLowerCase() === email.toLowerCase() || u.phone === phone
    );

    if (isDuplicate) {
      return res.status(400).json({ error: "An account with this email or phone number already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user object
    const newUser = {
      id: 'u_' + Date.now() + Math.random().toString(36).substr(2, 5),
      name,
      email,
      phone,
      address,
      pincode,
      password: hashedPassword
    };

    await db.saveUser(newUser);

    // Create token
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    // Exclude password in response
    const { password: _, ...userResponse } = newUser;

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: userResponse
    });
  } catch (err) {
    console.error("Signup Route Error:", err);
    return res.status(500).json({ error: "Internal server error during registration." });
  }
});

// 2. Login Route
router.post('/login', async (req, res) => {
  try {
    const { identity, password } = req.body;

    if (!identity || !password) {
      return res.status(400).json({ error: "Identity and password are required." });
    }

    const users = await db.getUsers();
    const cleanIdentity = identity.trim().toLowerCase();

    const user = users.find(u => 
      u.email.toLowerCase() === cleanIdentity || u.phone === cleanIdentity
    );

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials. Identity not found." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials. Incorrect password." });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Exclude password in response
    const { password: _, ...userResponse } = user;

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse
    });
  } catch (err) {
    console.error("Login Route Error:", err);
    return res.status(500).json({ error: "Internal server error during authentication." });
  }
});

// 3. GET Current Authenticated User (Validate JWT Session)
router.get('/me', auth, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
