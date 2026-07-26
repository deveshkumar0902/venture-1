const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get active cart for user
router.get('/', auth, async (req, res) => {
  try {
    const cart = await db.getCart(req.user.id);
    res.json(cart);
  } catch (err) {
    console.error("Cart GET Error:", err);
    res.status(500).json({ error: "Failed to fetch user cart" });
  }
});

// Update/Sync cart items
router.post('/', auth, async (req, res) => {
  try {
    const { cart } = req.body;
    if (!Array.isArray(cart)) {
      return res.status(400).json({ error: "Invalid data format: cart must be an array" });
    }
    const updatedCart = await db.saveCart(req.user.id, cart);
    res.json({ message: "Cart synced successfully", cart: updatedCart });
  } catch (err) {
    console.error("Cart POST Sync Error:", err);
    res.status(500).json({ error: "Failed to sync cart" });
  }
});

module.exports = router;
