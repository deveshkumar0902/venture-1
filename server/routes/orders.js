const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get order history for user
router.get('/', auth, async (req, res) => {
  try {
    const orders = await db.getOrders(req.user.id);
    // Sort orders by id or date descending (if we put a timestamp in)
    orders.reverse();
    res.json(orders);
  } catch (err) {
    console.error("Orders GET Error:", err);
    res.status(500).json({ error: "Failed to load order history" });
  }
});

// Place order (Checkout)
router.post('/', auth, async (req, res) => {
  try {
    const { items, subtotal } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cannot process checkout: Cart is empty." });
    }

    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const txnId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Create order structure
    const newOrder = {
      id: orderId,
      txnId: txnId,
      userId: req.user.id,
      items: items.map(item => ({
        id: item.product.id,
        name: item.product.name,
        size: item.size,
        quantity: item.quantity,
        price: item.product.price
      })),
      summary: items.map(item => `${item.quantity}x ${item.product.name} - ${item.size}`).join(', '),
      subtotal: subtotal || items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      date: new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }),
      status: 'IN TRANSIT' // Initial state
    };

    await db.createOrder(newOrder);

    res.status(201).json({
      message: "Order placed successfully",
      txnId: txnId,
      order: newOrder
    });
  } catch (err) {
    console.error("Order POST Error:", err);
    res.status(500).json({ error: "Failed to broadcast checkout reservation" });
  }
});

module.exports = router;
