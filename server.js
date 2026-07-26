require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./server/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and parsing of request bodies
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static assets from public/ folder
app.use(express.static(path.join(__dirname, 'public')));

// Import API Routers
const authRouter = require('./server/routes/auth');
const productsRouter = require('./server/routes/products');
const cartRouter = require('./server/routes/cart');
const wishlistRouter = require('./server/routes/wishlist');
const profileRouter = require('./server/routes/profile');
const ordersRouter = require('./server/routes/orders');

// Register API Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/profile', profileRouter);
app.use('/api/orders', ordersRouter);

// Fallback to serving index.html for direct browser visits to invalid URL routes
app.get('*', (req, res, next) => {
  // If request looks like an API call, return 404
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  // Otherwise serve main index.html storefront
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize database & Start server
async function startServer() {
  try {
    // Reading users triggers database load & seed check
    const users = await db.getUsers();
    console.log(`Database connected successfully. Seeded ${users.length} users.`);
    
    app.listen(PORT, () => {
      console.log(`===========================================================`);
      console.log(`NEO-THREAD // SECURE SERVER BROADCAST ACTIVE AT PORT ${PORT}`);
      console.log(`Access terminal interface: http://localhost:${PORT}`);
      console.log(`===========================================================`);
    });
  } catch (err) {
    console.error("Critical: Server failed to initialize database:", err);
    process.exit(1);
  }
}

startServer();
