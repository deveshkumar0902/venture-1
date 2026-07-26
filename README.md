# NEO-THREAD // Full-Stack Premium Streetwear Drops Store

Welcome to the full-stack version of **NEO-THREAD**, a cyber-streetwear storefront designed for rebels. The project has been upgraded to a production-ready, full-stack architecture with a Node.js/Express.js backend, dynamic product catalog management, persistent carts and wishlists, real order processing, and secure password-hashed member authentication.

---

## 🚀 Tech Stack & Design Architecture

1. **Frontend (Client)**: 
   - Clean, semantic HTML5 structure.
   - Customized premium styling system built with raw CSS (dark modes, boxy grids, 3D card tilt effects, glassmorphic drawers).
   - Dynamic client logic in Javascript (`app.js`, `login.js`, `signup.js`, `profile.js`) interacting with backend REST APIs.
2. **Backend (Server)**:
   - Built on Node.js and Express.js frameworks.
   - Serves web client files statically from the isolated `/public` folder.
   - Endpoints protected using a secure JWT authentication middleware.
3. **Database Layer**:
   - Pure-JS, file-backed database system (`server/db.js` writing to `server/data/db.json`).
   - Implements sequential write queues to ensure safe file modification.
   - Automatically seeds user data (demo account) and product assets on the first initialization.

---

## 📂 Project Structure

```
venture-1/
├── public/                 # Static web asset bundle served by Express
│   ├── app.js              # Store catalog, cart, and drawer rendering engine
│   ├── login.js            # Access connection auth controller
│   ├── signup.js           # New account registration controller
│   ├── profile.js          # Detailed shipping settings updates controller
│   ├── index.html          # Main application viewport shell
│   ├── login.html          # Secure login entrance
│   ├── signup.html         # Secure registration form
│   ├── profile.html        # Detailed user profile terminal
│   ├── index.css           # Premium styling theme and layout configurations
│   └── *.png, *.jpeg       # Streetwear graphics assets (12 product drops)
├── server/
│   ├── data/
│   │   └── db.json         # Persisted relational database store (auto-generated)
│   ├── middleware/
│   │   └── auth.js         # JWT validation authorization middleware
│   ├── routes/
│   │   ├── auth.js         # Signup, login, and active user verification endpoints
│   │   ├── products.js     # Catalog product listing and details endpoints
│   │   ├── cart.js         # Persistent cart load and sync endpoints
│   │   ├── wishlist.js     # Persistent wishlist load and sync endpoints
│   │   ├── profile.js      # Detailed shipping address profile update endpoint
│   │   └── orders.js       # Transaction checkout and history endpoints
│   └── db.js               # Database core controller and initialization seeds
├── .env                    # System port and JWT secret configuration values
├── package.json            # Dependencies metadata and startup commands
├── README.md               # Setup and launch guidelines
└── task.md                 # Checkpoint checklist
```

---

## 🛠️ Installation & Launch Guide

### 1. Prerequisite: Install Node.js
Ensure you have **Node.js** installed on your system. If you do not have it, download and install the latest LTS release from:
👉 [https://nodejs.org](https://nodejs.org)

*(To verify if Node is successfully registered in your PATH, run `node -v` and `npm -v` in your terminal or Command Prompt).*

### 2. Install Project Dependencies
Open your command terminal inside the project directory (`c:\Users\Shiv\Desktop\venture-1`) and run:
```bash
npm install
```
This downloads and registers the required runtime packages (`express`, `cors`, `dotenv`, `bcryptjs`, and `jsonwebtoken`).

### 3. Launch the Server
To boot the backend server in production/standard execution mode, run:
```bash
npm start
```
*Alternatively, for development mode with automatic restarts (if Node 18+ is used), run:*
```bash
npm run dev
```

### 4. Access the Website
Once launched, open your web browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔐 Seeding & Demo Access Credentials

Upon starting the server for the first time, a database file (`server/data/db.json`) is automatically generated and seeded with a default member account and the 12 streetwear product entries.

You can connect instantly with the following credentials:
* **E-Mail Address / Phone**: `shiv@neothread.com` (or `9876543210`)
* **Secure Passcode**: `password123`
