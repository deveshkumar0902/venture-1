const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await db.getProducts();
    res.json(products);
  } catch (err) {
    console.error("Products Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get specific product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Single Product Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch product details" });
  }
});

module.exports = router;
