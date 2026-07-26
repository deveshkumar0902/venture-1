const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DB_DIR, 'db.json');

let dbCache = null;
let writeQueue = Promise.resolve();

// Seed lists
const DEFAULT_PRODUCTS = [
  {
    id: 'm1',
    name: 'CYBERPUNK ONI TEE',
    category: 'MENS',
    price: 479,
    image: 'men_cyberpunk_oni.png',
    description: 'Oversized heavyweight black tee with high-definition neon cyber oni mask graphic. Premium drop-shoulder boxy fit.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'm2',
    name: 'TOKYO GRAFFITI TEE',
    category: 'MENS',
    price: 459,
    image: 'men_tokyo_graffiti.png',
    description: 'Relaxed-fit midnight black tee featuring vibrant acid green and white custom wildstyle graffiti chest block print.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'm3',
    name: 'MIDNIGHT VANDAL TEE',
    category: 'MENS',
    price: 499,
    image: 'men_midnight_vandal.png',
    description: 'Vintage mineral washed charcoal heavy tee with distressed white spray stencil graphics and raw edge finishes.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'm4',
    name: 'CHAMPIONS EDITION RCB JERSEY',
    category: 'MENS',
    price: 489,
    image: 'men_rcb_jersey.jpeg',
    description: 'Premium fan-edition black and slate grey striped jersey with gold piping and official crest detailing. Lightweight performance knit.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'm5',
    name: 'TENNIS CLUB GRAPHIC TEE',
    category: 'MENS',
    price: 469,
    image: 'men_tennis_club.jpeg',
    description: 'A pastel sky blue classic fit tee featuring a custom "One More Point" graphic illustration. Comfortable everyday wear.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'm6',
    name: 'LOVE THE GAME COURT TEE',
    category: 'MENS',
    price: 499,
    image: 'men_love_game.jpeg',
    description: 'Heavyweight matte black tee showcasing a striking pink graphic of a tennis player in motion with clean typographic styling.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'w1',
    name: 'HARAJUKU BUTTERFLY CROP',
    category: 'WOMENS',
    price: 469,
    image: 'women_harajuku_butterfly.png',
    description: 'Gothic black crop baby tee featuring detailed metallic cyber-butterfly wings and hot violet flame prints.',
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'w2',
    name: 'ACID GRID BABY TEE',
    category: 'WOMENS',
    price: 489,
    image: 'women_acid_grid.png',
    description: 'Slim fit ribbed baby tee in deep black with custom neon toxic-green digital cyber matrix-grid artwork.',
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'w3',
    name: 'SYNTHWAVE SIREN TEE',
    category: 'WOMENS',
    price: 479,
    image: 'women_synthwave_siren.png',
    description: 'Oversized crisp white drop-shoulder tee with a gorgeous neon violet and cyan retro anime cyber-siren graphic.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'w4',
    name: 'RETRO SKY BUBBLE TEE',
    category: 'WOMENS',
    price: 459,
    image: 'women_retro_sky.jpeg',
    description: 'Pastel light blue oversized tee featuring a vintage 70s-inspired bubbly white typography design. Extremely soft and relaxed.',
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'w5',
    name: 'VARSITY 99 KNIT SWEATER',
    category: 'WOMENS',
    price: 499,
    image: 'women_varsity_99.jpeg',
    description: 'Premium heavy knit cream cable sweater featuring a classic ribbed v-neck, collegiate striped trim, and a bold 99 varsity chest print.',
    sizes: ['S', 'M', 'L']
  },
  {
    id: 'w6',
    name: 'NEW YORK ARCH TEE',
    category: 'WOMENS',
    price: 479,
    image: 'women_new_york.jpeg',
    description: 'Deep chocolate brown oversized tee featuring a bold vintage arched New York chest print. Perfect streetwear basic.',
    sizes: ['S', 'M', 'L', 'XL']
  }
];

async function seedDb() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  const defaultUser = {
    id: 'u1',
    name: "Shiv Kumar",
    phone: "9876543210",
    email: "shiv@neothread.com",
    address: "123 Cyber Street, Sector 404",
    pincode: "110001",
    password: hashedPassword
  };

  const initialData = {
    users: [defaultUser],
    products: DEFAULT_PRODUCTS,
    carts: {},
    wishlists: {},
    orders: []
  };

  dbCache = initialData;
  await fs.mkdir(DB_DIR, { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
}

async function readDb() {
  if (dbCache) return dbCache;
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    dbCache = JSON.parse(data);
    return dbCache;
  } catch (err) {
    await seedDb();
    return dbCache;
  }
}

async function writeDb(data) {
  dbCache = data;
  writeQueue = writeQueue.then(async () => {
    try {
      await fs.mkdir(DB_DIR, { recursive: true });
      await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error("Database write error:", err);
    }
  });
  return writeQueue;
}

// Queries API
module.exports = {
  getUsers: async () => {
    const db = await readDb();
    return db.users;
  },
  saveUser: async (user) => {
    const db = await readDb();
    const index = db.users.findIndex(u => u.id === user.id);
    if (index > -1) {
      db.users[index] = user;
    } else {
      db.users.push(user);
    }
    await writeDb(db);
    return user;
  },
  getProducts: async () => {
    const db = await readDb();
    return db.products;
  },
  getProductById: async (id) => {
    const db = await readDb();
    return db.products.find(p => p.id === id);
  },
  getCart: async (userId) => {
    const db = await readDb();
    return db.carts[userId] || [];
  },
  saveCart: async (userId, cartItems) => {
    const db = await readDb();
    db.carts[userId] = cartItems;
    await writeDb(db);
    return cartItems;
  },
  getWishlist: async (userId) => {
    const db = await readDb();
    return db.wishlists[userId] || [];
  },
  saveWishlist: async (userId, wishlistItems) => {
    const db = await readDb();
    db.wishlists[userId] = wishlistItems;
    await writeDb(db);
    return wishlistItems;
  },
  getOrders: async (userId) => {
    const db = await readDb();
    return db.orders.filter(o => o.userId === userId);
  },
  createOrder: async (order) => {
    const db = await readDb();
    db.orders.push(order);
    // Clear user cart upon successful order
    db.carts[order.userId] = [];
    await writeDb(db);
    return order;
  }
};
