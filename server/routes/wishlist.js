const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get active wishlist for user
router.get('/', auth, async (req, res) => {
  try {
    const wishlist = await db.getWishlist(req.user.id);
    res.json(wishlist);
  } catch (err) {
    console.error("Wishlist GET Error:", err);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// Update/Sync wishlist items
router.post('/', auth, async (req, res) => {
  try {
    const { wishlist } = req.body;
    if (!Array.isArray(wishlist)) {
      return res.status(400).json({ error: "Invalid data format: wishlist must be an array" });
    }
    const updatedWishlist = await db.saveWishlist(req.user.id, wishlist);
    res.json({ message: "Wishlist synced successfully", wishlist: updatedWishlist });
  } catch (err) {
    console.error("Wishlist POST Sync Error:", err);
    res.status(500).json({ error: "Failed to sync wishlist" });
  }
});

module.exports = router;
