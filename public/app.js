// NEO-THREAD // STREETWEAR E-COMMERCE APPLICATION ENGINE

// 1. PRODUCT DATABASE
let PRODUCTS = [];

// 2. STATE MANAGER
let state = {
  currentCategory: 'ALL', // 'ALL', 'MENS', 'WOMENS'
  searchQuery: '',
  cart: [],
  wishlist: [],
  selectedSizes: {} // Maps productID -> size selected in grid
};

// 2b. SERVER SYNCHRONIZERS
async function syncCartWithServer() {
  try {
    const token = localStorage.getItem('neo_token');
    if (!token) return;
    await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cart: state.cart })
    });
  } catch (err) {
    console.error("Failed to sync cart with server:", err);
  }
}

async function syncWishlistWithServer() {
  try {
    const token = localStorage.getItem('neo_token');
    if (!token) return;
    await fetch('/api/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ wishlist: state.wishlist })
    });
  } catch (err) {
    console.error("Failed to sync wishlist with server:", err);
  }
}

async function loadServerData() {
  const token = localStorage.getItem('neo_token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // 1. Verify User Session & Get Fresh User Details
  try {
    const authRes = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!authRes.ok) {
      localStorage.removeItem('neo_token');
      localStorage.removeItem('neo_logged_in_user');
      window.location.href = 'login.html';
      return;
    }
    const freshUserObj = await authRes.json();
    localStorage.setItem('neo_logged_in_user', JSON.stringify(freshUserObj));
    updateAccountDrawerDetails();
  } catch (err) {
    console.error("Session verification failure:", err);
  }

  // 2. Fetch Dynamic Catalog Products
  try {
    const prodRes = await fetch('/api/products');
    PRODUCTS = await prodRes.json();
  } catch (err) {
    console.error("Failed to load catalog products:", err);
  }

  // 3. Fetch Persistent Cart from Server
  try {
    const cartRes = await fetch('/api/cart', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (cartRes.ok) {
      state.cart = await cartRes.json();
      localStorage.setItem('neo_cart', JSON.stringify(state.cart));
    }
  } catch (err) {
    console.error("Failed to load user cart:", err);
  }

  // 4. Fetch Persistent Wishlist from Server
  try {
    const wishlistRes = await fetch('/api/wishlist', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (wishlistRes.ok) {
      state.wishlist = await wishlistRes.json();
      localStorage.setItem('neo_wishlist', JSON.stringify(state.wishlist));
    }
  } catch (err) {
    console.error("Failed to load user wishlist:", err);
  }

  // 5. Fetch Order History
  await loadOrderHistory();

  // 6. Initial render pass
  renderCatalog();
  renderCart();
  renderWishlist();
}

async function loadOrderHistory() {
  try {
    const token = localStorage.getItem('neo_token');
    if (!token) return;

    const res = await fetch('/api/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const orders = await res.json();
      renderOrdersList(orders);
    }
  } catch (err) {
    console.error("Failed to load order history from server:", err);
  }
}

function renderOrdersList(orders) {
  const container = document.querySelector('.orders-list');
  if (!container) return;

  if (orders.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 20px 0; color: var(--text-secondary); font-size: 0.85rem;">
        NO TRANSACTION RECORDS FOUND
      </div>
    `;
    return;
  }

  container.innerHTML = orders.map(order => {
    const statusClass = order.status.toLowerCase().replace(/\s+/g, '-');
    return `
      <div class="order-item">
        <div class="order-meta">
          <span class="order-id">${order.id}</span>
          <span class="order-date">${order.date}</span>
        </div>
        <div class="order-summary" style="font-size: 0.75rem; color: var(--text-primary); margin: 6px 0;">${order.summary}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
          <span style="font-size: 0.8rem; font-weight: bold; color: var(--accent-lime);">₹${order.subtotal.toLocaleString('en-IN')}</span>
          <span class="order-status-badge ${statusClass}">${order.status}</span>
        </div>
      </div>
    `;
  }).join('');
}

// 3. DOM ELEMENTS
const DOM = {
  // Navigation & Filtering
  navHome: document.getElementById('nav-home'),
  navMens: document.getElementById('nav-mens'),
  navWomens: document.getElementById('nav-womens'),
  logoButton: document.getElementById('logo-button'),
  heroBanner: document.getElementById('hero-banner'),
  heroShopMens: document.getElementById('hero-shop-mens'),
  heroShopWomens: document.getElementById('hero-shop-womens'),
  footerMens: document.getElementById('footer-mens'),
  footerWomens: document.getElementById('footer-womens'),
  footerAll: document.getElementById('footer-all'),
  catalogTitle: document.getElementById('catalog-title-display'),
  catalogCount: document.getElementById('catalog-count-display'),
  productGrid: document.getElementById('product-grid-container'),

  // Search bar
  searchInput: document.getElementById('search-input'),
  clearSearchBtn: document.getElementById('clear-search-btn'),
  activeFiltersContainer: document.getElementById('active-filters-container'),
  filterTagText: document.getElementById('filter-tag-text'),
  removeFilterBtn: document.getElementById('remove-filter-btn'),

  // Drawer Toggles
  wishlistTrigger: document.getElementById('wishlist-trigger'),
  cartTrigger: document.getElementById('cart-trigger'),
  accountTrigger: document.getElementById('account-trigger'),

  drawerOverlay: document.getElementById('drawer-overlay'),
  cartDrawer: document.getElementById('cart-drawer'),
  wishlistDrawer: document.getElementById('wishlist-drawer'),
  accountDrawer: document.getElementById('account-drawer'),

  cartCloseBtn: document.getElementById('cart-close-btn'),
  wishlistCloseBtn: document.getElementById('wishlist-close-btn'),
  accountCloseBtn: document.getElementById('account-close-btn'),

  // Badges
  cartBadge: document.getElementById('cart-badge'),
  wishlistBadge: document.getElementById('wishlist-badge'),

  // Drawer containers
  cartItemsContainer: document.getElementById('cart-items-container'),
  wishlistItemsContainer: document.getElementById('wishlist-items-container'),
  cartDrawerCount: document.getElementById('cart-drawer-count'),
  wishlistDrawerCount: document.getElementById('wishlist-drawer-count'),
  cartSubtotalDisplay: document.getElementById('cart-subtotal-display'),
  cartFooter: document.getElementById('cart-footer'),
  checkoutBtn: document.getElementById('checkout-btn'),

  // Checkout Modal
  checkoutModal: document.getElementById('checkout-modal'),
  closeCheckoutModalBtn: document.getElementById('close-checkout-modal-btn')
};

// 4. STORAGE SYNCHRONIZERS
function saveStateToStorage() {
  localStorage.setItem('neo_cart', JSON.stringify(state.cart));
  localStorage.setItem('neo_wishlist', JSON.stringify(state.wishlist));
  syncCartWithServer();
  syncWishlistWithServer();
}

// 5. RENDERING PIPELINE

// Render Catalog Grid
function renderCatalog() {
  // Filter products by navigation tab
  let filtered = PRODUCTS;

  if (state.currentCategory !== 'ALL') {
    filtered = filtered.filter(p => p.category === state.currentCategory);
  }

  // Apply Search filter
  if (state.searchQuery.trim() !== '') {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
  }

  // Render count display
  DOM.catalogCount.innerText = `${filtered.length} ${filtered.length === 1 ? 'DROP' : 'DROPS'}`;

  // Setup Grid Catalog Header Text
  if (state.searchQuery) {
    DOM.catalogTitle.innerText = `SEARCH RESULTS`;
    DOM.activeFiltersContainer.style.display = 'flex';
    DOM.filterTagText.innerText = `SEARCH: "${state.searchQuery.toUpperCase()}"`;
  } else {
    DOM.activeFiltersContainer.style.display = 'none';
    if (state.currentCategory === 'ALL') {
      DOM.catalogTitle.innerText = 'ALL RELEASES';
    } else if (state.currentCategory === 'MENS') {
      DOM.catalogTitle.innerText = "MEN'S DROPS";
    } else if (state.currentCategory === 'WOMENS') {
      DOM.catalogTitle.innerText = "WOMEN'S DROPS";
    }
  }

  // Render Grid Content
  if (filtered.length === 0) {
    DOM.productGrid.innerHTML = `
      <div class="drawer-empty-state" style="grid-column: 1 / -1; padding: 60px 0;">
        <i data-lucide="search-slash" style="width: 48px; height: 48px; margin-bottom: 16px;"></i>
        <h3 style="font-family: var(--font-heading); margin-bottom: 8px;">NO ITEMS FOUND</h3>
        <p>Try refining your search query or switching categories.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  DOM.productGrid.innerHTML = filtered.map(product => {
    const isWishlisted = state.wishlist.some(item => item.id === product.id);
    const selectedSize = state.selectedSizes[product.id] || product.sizes[0];
    const categoryClass = product.category === 'MENS' ? 'men-card' : 'women-card';
    const badgeText = product.category === 'MENS' ? 'MEN\'S' : 'WOMEN\'S';
    const badgeClass = product.category === 'MENS' ? 'mens-badge' : 'womens-badge';

    // Draw Size selectors
    const sizeButtons = product.sizes.map(size => {
      const activeClass = selectedSize === size ? 'selected' : '';
      return `<button class="size-btn ${activeClass}" data-id="${product.id}" data-size="${size}">${size}</button>`;
    }).join('');

    return `
      <article class="product-card ${categoryClass}">
        <div class="product-card-header">
          <div class="card-shine"></div>
          <span class="card-badge ${badgeClass}">${badgeText}</span>
          <button class="wishlist-toggle-btn ${isWishlisted ? 'wishlisted' : ''}" data-id="${product.id}" aria-label="Toggle Wishlist">
            <i data-lucide="heart" ${isWishlisted ? 'fill="currentColor"' : ''}></i>
          </button>
          <img src="${product.image}" alt="${product.name}" class="product-card-img" loading="lazy">
          <div class="size-selector-overlay">
            ${sizeButtons}
          </div>
        </div>
        <div class="product-card-details">
          <div class="product-meta-row">
            <h3 class="product-card-title">${product.name}</h3>
            <span class="product-card-price">₹${product.price.toLocaleString('en-IN')}</span>
          </div>
          <p class="product-card-desc">${product.description}</p>
          <button class="add-cart-btn" data-id="${product.id}">
            <i data-lucide="shopping-bag"></i>
            <span>ADD TO CART (${selectedSize})</span>
          </button>
        </div>
      </article>
    `;
  }).join('');

  // Re-run lucide renderer to display dynamic icons correctly
  lucide.createIcons();

  // Attach Event listeners to new grid elements
  attachGridEvents();
}

// Render Cart Drawer Contents
function renderCart() {
  const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  // Update Badges
  if (totalItems > 0) {
    DOM.cartBadge.innerText = totalItems;
    DOM.cartBadge.style.display = 'flex';
    DOM.cartDrawerCount.innerText = `(${totalItems})`;
  } else {
    DOM.cartBadge.style.display = 'none';
    DOM.cartDrawerCount.innerText = `(0)`;
  }

  if (state.cart.length === 0) {
    DOM.cartItemsContainer.innerHTML = `
      <div class="drawer-empty-state">
        <i data-lucide="shopping-bag"></i>
        <h3 style="font-family: var(--font-heading); margin-bottom: 8px;">CART IS EMPTY</h3>
        <p>No gear has been checked out yet. Explore the releases to claim your items.</p>
        <button class="btn btn-primary" id="cart-back-shop">GO TO RELEASES</button>
      </div>
    `;
    DOM.cartFooter.style.display = 'none';

    // Add event listener to "GO TO RELEASES" empty state button
    const backBtn = document.getElementById('cart-back-shop');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        closeAllDrawers();
        setCategory('ALL');
      });
    }
  } else {
    DOM.cartFooter.style.display = 'block';

    // Calculate total subtotal
    const subtotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    DOM.cartSubtotalDisplay.innerText = `₹${subtotal.toLocaleString('en-IN')}`;

    DOM.cartItemsContainer.innerHTML = state.cart.map((item, index) => {
      return `
        <div class="drawer-item">
          <img src="${item.product.image}" alt="${item.product.name}" class="drawer-item-img">
          <div class="drawer-item-details">
            <div class="drawer-item-meta">
              <div>
                <h4 class="drawer-item-name">${item.product.name}</h4>
                <div class="drawer-item-size">SIZE: ${item.size}</div>
              </div>
              <button class="drawer-item-remove" data-index="${index}" aria-label="Remove item">
                <i data-lucide="trash-2"></i>
              </button>
            </div>
            <div class="drawer-item-controls">
              <div class="qty-controls">
                <button class="qty-btn dec-qty" data-index="${index}">&minus;</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn inc-qty" data-index="${index}">&plus;</button>
              </div>
              <span class="drawer-item-price">₹${(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  lucide.createIcons();
  attachCartEvents();
}

// Render Wishlist Drawer Contents
function renderWishlist() {
  const totalItems = state.wishlist.length;

  if (totalItems > 0) {
    DOM.wishlistBadge.innerText = totalItems;
    DOM.wishlistBadge.style.display = 'flex';
    DOM.wishlistDrawerCount.innerText = `(${totalItems})`;
  } else {
    DOM.wishlistBadge.style.display = 'none';
    DOM.wishlistDrawerCount.innerText = `(0)`;
  }

  if (state.wishlist.length === 0) {
    DOM.wishlistItemsContainer.innerHTML = `
      <div class="drawer-empty-state">
        <i data-lucide="heart"></i>
        <h3 style="font-family: var(--font-heading); margin-bottom: 8px;">WISHLIST EMPTY</h3>
        <p>Add drops you want to keep an eye on. Claim them before stock runs dry.</p>
      </div>
    `;
  } else {
    DOM.wishlistItemsContainer.innerHTML = state.wishlist.map((product, index) => {
      return `
        <div class="drawer-item">
          <img src="${product.image}" alt="${product.name}" class="drawer-item-img">
          <div class="drawer-item-details">
            <div class="drawer-item-meta">
              <div>
                <h4 class="drawer-item-name">${product.name}</h4>
                <div class="drawer-item-price" style="margin-top: 4px;">₹${product.price.toLocaleString('en-IN')}</div>
              </div>
              <button class="drawer-item-remove-wishlist" data-index="${index}" aria-label="Remove from wishlist">
                <i data-lucide="x"></i>
              </button>
            </div>
            <div class="wishlist-item-actions">
              <button class="btn-move-cart" data-index="${index}">MOVE TO CART (M)</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  lucide.createIcons();
  attachWishlistEvents();
}


// 6. ACTION DISPATCHERS / EVENT HANDLERS

// Select size in the grid
function handleSizeSelect(productId, size) {
  state.selectedSizes[productId] = size;
  renderCatalog();
}

// Toggle product in wishlist
function toggleWishlist(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = state.wishlist.findIndex(item => item.id === productId);

  if (existingIndex > -1) {
    state.wishlist.splice(existingIndex, 1);
  } else {
    state.wishlist.push(product);
  }

  saveStateToStorage();
  renderCatalog();
  renderWishlist();
}

// Add item to Cart
function addToCart(productId, sizeInput = null) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  // Use chosen grid size or fall back to default first size
  const size = sizeInput || state.selectedSizes[productId] || product.sizes[0];

  // Check if item with exact product and size already in cart
  const existingItemIndex = state.cart.findIndex(
    item => item.product.id === productId && item.size === size
  );

  if (existingItemIndex > -1) {
    state.cart[existingItemIndex].quantity += 1;
  } else {
    state.cart.push({
      product,
      size,
      quantity: 1
    });
  }

  saveStateToStorage();
  renderCart();

  // Visual feedback: Open cart automatically to confirm add
  openDrawer(DOM.cartDrawer);
}

// Remove from cart
function removeFromCart(index) {
  state.cart.splice(index, 1);
  saveStateToStorage();
  renderCart();
}

// Change cart item quantity
function adjustCartQuantity(index, delta) {
  const targetItem = state.cart[index];
  if (!targetItem) return;

  targetItem.quantity += delta;

  if (targetItem.quantity <= 0) {
    removeFromCart(index);
  } else {
    saveStateToStorage();
    renderCart();
  }
}

// Move from wishlist to cart
function moveWishlistToCart(index) {
  const product = state.wishlist[index];
  if (!product) return;

  // Add to cart with default size M
  addToCart(product.id, 'M');

  // Remove from wishlist
  state.wishlist.splice(index, 1);
  saveStateToStorage();

  renderWishlist();
  renderCatalog();
}

// 7. ROUTING AND VIEW HANDLERS
function setCategory(category) {
  state.currentCategory = category;

  // Update nav active states
  DOM.navHome.classList.remove('active');
  DOM.navMens.classList.remove('active');
  DOM.navWomens.classList.remove('active');

  if (category === 'ALL') {
    DOM.navHome.classList.add('active');
    DOM.heroBanner.style.display = 'grid'; // Show hero banner
  } else {
    DOM.heroBanner.style.display = 'none'; // Hide hero banner on categories
    if (category === 'MENS') {
      DOM.navMens.classList.add('active');
    } else if (category === 'WOMENS') {
      DOM.navWomens.classList.add('active');
    }
  }

  // Clear search queries when changing tabs
  if (state.searchQuery !== '') {
    state.searchQuery = '';
    DOM.searchInput.value = '';
    DOM.clearSearchBtn.style.display = 'none';
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderCatalog();
}

// Realtime search text keyup handler
function handleSearch(query) {
  state.searchQuery = query;

  if (query.trim() !== '') {
    DOM.clearSearchBtn.style.display = 'flex';
    // If searching, hide hero banner to focus on results
    DOM.heroBanner.style.display = 'none';

    // Clear navigation highlights because we are in search-view
    DOM.navHome.classList.remove('active');
    DOM.navMens.classList.remove('active');
    DOM.navWomens.classList.remove('active');
  } else {
    DOM.clearSearchBtn.style.display = 'none';
    // Restore layout based on category
    if (state.currentCategory === 'ALL') {
      DOM.navHome.classList.add('active');
      DOM.heroBanner.style.display = 'grid';
    } else {
      if (state.currentCategory === 'MENS') DOM.navMens.classList.add('active');
      if (state.currentCategory === 'WOMENS') DOM.navWomens.classList.add('active');
    }
  }

  renderCatalog();
}

// 8. INTERACTIVE DRAWER CONTROLLER
function openDrawer(drawerElement) {
  closeAllDrawers();
  drawerElement.classList.add('active');
  DOM.drawerOverlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Lock scrolling
}

function closeAllDrawers() {
  DOM.cartDrawer.classList.remove('active');
  DOM.wishlistDrawer.classList.remove('active');
  DOM.accountDrawer.classList.remove('active');
  DOM.drawerOverlay.classList.remove('active');
  document.body.style.overflow = ''; // Unlock scrolling
}

// 9. EVENT REGISTRATION

// Grid element events (since grid items are dynamic)
function attachGridEvents() {
  // Wishlist heart clicks
  DOM.productGrid.querySelectorAll('.wishlist-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = btn.getAttribute('data-id');
      toggleWishlist(productId);
    });
  });

  // Size select buttons
  DOM.productGrid.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = btn.getAttribute('data-id');
      const size = btn.getAttribute('data-size');
      handleSizeSelect(productId, size);
    });
  });

  // Add to cart buttons
  DOM.productGrid.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = btn.getAttribute('data-id');
      addToCart(productId);
    });
  });

  // 3D Card tilt effect on mousemove
  DOM.productGrid.querySelectorAll('.product-card').forEach(card => {
    const header = card.querySelector('.product-card-header');
    const img = card.querySelector('.product-card-img');
    const shine = card.querySelector('.card-shine');

    if (!header || !img) return;

    header.addEventListener('mousemove', (e) => {
      const rect = header.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Rotate up to 25 degrees depending on cursor position
      const rotateY = ((x - centerX) / centerX) * 25;
      const rotateX = -((y - centerY) / centerY) * 25;

      img.style.transform = `scale(1.08) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      if (shine) {
        const pctX = (x / rect.width) * 100;
        const pctY = (y / rect.height) * 100;
        shine.style.background = `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)`;
      }
    });

    header.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
      if (shine) {
        shine.style.background = 'transparent';
      }
    });
  });
}

// Cart items drawer actions events
function attachCartEvents() {
  // Quantity increment
  DOM.cartItemsContainer.querySelectorAll('.inc-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      adjustCartQuantity(idx, 1);
    });
  });

  // Quantity decrement
  DOM.cartItemsContainer.querySelectorAll('.dec-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      adjustCartQuantity(idx, -1);
    });
  });

  // Remove item
  DOM.cartItemsContainer.querySelectorAll('.drawer-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      removeFromCart(idx);
    });
  });
}

// Wishlist item events in drawer
function attachWishlistEvents() {
  // Remove from wishlist
  DOM.wishlistItemsContainer.querySelectorAll('.drawer-item-remove-wishlist').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      const product = state.wishlist[idx];
      toggleWishlist(product.id);
    });
  });

  // Move from wishlist to cart
  DOM.wishlistItemsContainer.querySelectorAll('.btn-move-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      moveWishlistToCart(idx);
    });
  });
}

// Dynamic Profile Updates for Account Drawer
function updateAccountDrawerDetails() {
  const loggedInUser = JSON.parse(localStorage.getItem('neo_logged_in_user'));
  if (loggedInUser) {
    // Update username
    const usernameEl = document.querySelector('.profile-details .username');
    if (usernameEl) {
      usernameEl.innerText = loggedInUser.name.toUpperCase().replace(/\s+/g, '_');
    }
    
    // Update email
    const emailEl = document.getElementById('user-display-email');
    if (emailEl) {
      emailEl.innerText = loggedInUser.email;
    }

    // Update phone
    const phoneEl = document.getElementById('user-display-phone');
    if (phoneEl) {
      phoneEl.innerText = loggedInUser.phone || '';
    }

    // Update address
    const addressEl = document.getElementById('user-display-address');
    if (addressEl) {
      if (loggedInUser.addressLine1) {
        const addr1 = loggedInUser.addressLine1;
        const addr2 = loggedInUser.addressLine2 ? `, ${loggedInUser.addressLine2}` : '';
        const city = loggedInUser.city ? `, ${loggedInUser.city}` : '';
        const state = loggedInUser.state ? `, ${loggedInUser.state}` : '';
        const pincode = loggedInUser.pincode ? `, Pin: ${loggedInUser.pincode}` : '';
        addressEl.innerText = `${addr1}${addr2}${city}${state}${pincode}`;
      } else {
        const pinStr = loggedInUser.pincode ? `, Pin: ${loggedInUser.pincode}` : '';
        const addr = loggedInUser.address || '';
        addressEl.innerText = `${addr}${pinStr}`;
      }
    }
  }
}

// Core setup and binding
function initApp() {
  // Category route binding
  DOM.navHome.addEventListener('click', () => setCategory('ALL'));
  DOM.navMens.addEventListener('click', () => setCategory('MENS'));
  DOM.navWomens.addEventListener('click', () => setCategory('WOMENS'));
  DOM.logoButton.addEventListener('click', (e) => {
    e.preventDefault();
    setCategory('ALL');
  });

  // Hero CTAs
  DOM.heroShopMens.addEventListener('click', () => setCategory('MENS'));
  DOM.heroShopWomens.addEventListener('click', () => setCategory('WOMENS'));

  // Footer navigation
  DOM.footerMens.addEventListener('click', (e) => { e.preventDefault(); setCategory('MENS'); });
  DOM.footerWomens.addEventListener('click', (e) => { e.preventDefault(); setCategory('WOMENS'); });
  DOM.footerAll.addEventListener('click', (e) => { e.preventDefault(); setCategory('ALL'); });

  // Search input typing
  DOM.searchInput.addEventListener('input', (e) => {
    handleSearch(e.target.value);
  });

  DOM.clearSearchBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    handleSearch('');
  });

  DOM.removeFilterBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    handleSearch('');
  });

  // Drawer triggers
  DOM.wishlistTrigger.addEventListener('click', () => openDrawer(DOM.wishlistDrawer));
  DOM.cartTrigger.addEventListener('click', () => openDrawer(DOM.cartDrawer));
  DOM.accountTrigger.addEventListener('click', () => openDrawer(DOM.accountDrawer));

  // Drawer close buttons
  DOM.cartCloseBtn.addEventListener('click', closeAllDrawers);
  DOM.wishlistCloseBtn.addEventListener('click', closeAllDrawers);
  DOM.accountCloseBtn.addEventListener('click', closeAllDrawers);
  DOM.drawerOverlay.addEventListener('click', closeAllDrawers);

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDrawers();
  });

  // Real Checkout trigger
  DOM.checkoutBtn.addEventListener('click', async () => {
    if (state.cart.length === 0) return;
    
    const subtotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const cartItemsCopy = [...state.cart];

    try {
      const token = localStorage.getItem('neo_token');
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItemsCopy,
          subtotal: subtotal
        })
      });

      const data = await res.json();

      if (res.ok) {
        closeAllDrawers();
        
        // Update Modal details dynamically
        const modalContainer = DOM.checkoutModal.querySelector('.modal-container');
        if (modalContainer) {
          const detailRows = modalContainer.querySelectorAll('.modal-details div');
          if (detailRows.length >= 2) {
            detailRows[0].innerHTML = `<strong>Transaction ID:</strong> ${data.txnId}`;
            detailRows[1].innerHTML = `<strong>Status:</strong> ${data.order.status}`;
          }
        }

        // Reset Cart state
        state.cart = [];
        localStorage.setItem('neo_cart', JSON.stringify([]));
        
        renderCart();
        loadOrderHistory();

        // Open Success Modal
        DOM.checkoutModal.classList.add('active');
      } else {
        alert(data.error || "Checkout failed");
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Failed to submit checkout reservation: Server connection lost.");
    }
  });

  DOM.closeCheckoutModalBtn.addEventListener('click', () => {
    DOM.checkoutModal.classList.remove('active');
  });

  // Account logout
  document.getElementById('logout-btn').addEventListener('click', () => {
    if (confirm('Disconnect terminal session? Local authentication cache will be cleared.')) {
      localStorage.removeItem('neo_token');
      localStorage.removeItem('neo_logged_in_user');
      localStorage.removeItem('neo_cart');
      localStorage.removeItem('neo_wishlist');
      window.location.href = 'login.html';
    }
  });

  // 3D tilt for hero card
  const heroCard = document.querySelector('.visual-card');
  if (heroCard) {
    const img = heroCard.querySelector('.hero-img');
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 20;
      const rotateX = -((y - centerY) / centerY) * 20;
      img.style.transform = `scale(1.04) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    heroCard.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
    });
  }

  // Render lucide icons for elements loaded by the core index.html shell
  lucide.createIcons();
}

// Initialise application on load
window.addEventListener('DOMContentLoaded', () => {
  initApp();
  loadServerData();
});


