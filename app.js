// NEO-THREAD // STREETWEAR E-COMMERCE APPLICATION ENGINE

// 1. PRODUCT DATABASE
const PRODUCTS = [
  {
    id: 'm1',
    name: 'CYBERPUNK ONI TEE',
    category: 'MENS',
    price: 479,
    image: 'assets/men_cyberpunk_oni.png',
    description: 'Oversized heavyweight black tee with high-definition neon cyber oni mask graphic. Premium drop-shoulder boxy fit.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'm2',
    name: 'TOKYO GRAFFITI TEE',
    category: 'MENS',
    price: 459,
    image: 'assets/men_tokyo_graffiti.png',
    description: 'Relaxed-fit midnight black tee featuring vibrant acid green and white custom wildstyle graffiti chest block print.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'm3',
    name: 'MIDNIGHT VANDAL TEE',
    category: 'MENS',
    price: 499,
    image: 'assets/men_midnight_vandal.png',
    description: 'Vintage mineral washed charcoal heavy tee with distressed white spray stencil graphics and raw edge finishes.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'm4',
    name: 'CHAMPIONS EDITION RCB JERSEY',
    category: 'MENS',
    price: 489,
    image: 'assets/men_rcb_jersey.jpeg',
    description: 'Premium fan-edition black and slate grey striped jersey with gold piping and official crest detailing. Lightweight performance knit.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'm5',
    name: 'TENNIS CLUB GRAPHIC TEE',
    category: 'MENS',
    price: 469,
    image: 'assets/men_tennis_club.jpeg',
    description: 'A pastel sky blue classic fit tee featuring a custom "One More Point" graphic illustration. Comfortable everyday wear.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'm6',
    name: 'LOVE THE GAME COURT TEE',
    category: 'MENS',
    price: 499,
    image: 'assets/men_love_game.jpeg',
    description: 'Heavyweight matte black tee showcasing a striking pink graphic of a tennis player in motion with clean typographic styling.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'w1',
    name: 'HARAJUKU BUTTERFLY CROP',
    category: 'WOMENS',
    price: 469,
    image: 'assets/women_harajuku_butterfly.png',
    description: 'Gothic black crop baby tee featuring detailed metallic cyber-butterfly wings and hot violet flame prints.',
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'w2',
    name: 'ACID GRID BABY TEE',
    category: 'WOMENS',
    price: 489,
    image: 'assets/women_acid_grid.png',
    description: 'Slim fit ribbed baby tee in deep black with custom neon toxic-green digital cyber matrix-grid artwork.',
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'w3',
    name: 'SYNTHWAVE SIREN TEE',
    category: 'WOMENS',
    price: 479,
    image: 'assets/women_synthwave_siren.png',
    description: 'Oversized crisp white drop-shoulder tee with a gorgeous neon violet and cyan retro anime cyber-siren graphic.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'w4',
    name: 'RETRO SKY BUBBLE TEE',
    category: 'WOMENS',
    price: 459,
    image: 'assets/women_retro_sky.jpeg',
    description: 'Pastel light blue oversized tee featuring a vintage 70s-inspired bubbly white typography design. Extremely soft and relaxed.',
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    id: 'w5',
    name: 'VARSITY 99 KNIT SWEATER',
    category: 'WOMENS',
    price: 499,
    image: 'assets/women_varsity_99.jpeg',
    description: 'Premium heavy knit cream cable sweater featuring a classic ribbed v-neck, collegiate striped trim, and a bold 99 varsity chest print.',
    sizes: ['S', 'M', 'L']
  },
  {
    id: 'w6',
    name: 'NEW YORK ARCH TEE',
    category: 'WOMENS',
    price: 479,
    image: 'assets/women_new_york.jpeg',
    description: 'Deep chocolate brown oversized tee featuring a bold vintage arched New York chest print. Perfect streetwear basic.',
    sizes: ['S', 'M', 'L', 'XL']
  }
];

// 2. STATE MANAGER
let state = {
  currentCategory: 'ALL', // 'ALL', 'MENS', 'WOMENS'
  searchQuery: '',
  cart: JSON.parse(localStorage.getItem('neo_cart')) || [],
  wishlist: JSON.parse(localStorage.getItem('neo_wishlist')) || [],
  selectedSizes: {} // Maps productID -> size selected in grid
};

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

  // Simulated Checkout trigger
  DOM.checkoutBtn.addEventListener('click', () => {
    closeAllDrawers();
    // Reset Cart
    state.cart = [];
    saveStateToStorage();
    renderCart();

    // Open Success Modal
    DOM.checkoutModal.classList.add('active');
  });

  DOM.closeCheckoutModalBtn.addEventListener('click', () => {
    DOM.checkoutModal.classList.remove('active');
  });

  // Account logout warning demo
  document.getElementById('logout-btn').addEventListener('click', () => {
    alert('Simulating disconnect: Clear local storage? All items in cart and wishlist will reset.');
    state.cart = [];
    state.wishlist = [];
    saveStateToStorage();
    renderCart();
    renderWishlist();
    renderCatalog();
    closeAllDrawers();
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

  // Initial runs
  renderCatalog();
  renderCart();
  renderWishlist();

  // Render lucide icons for elements loaded by the core index.html shell
  lucide.createIcons();
}

// Initialise application on load
window.addEventListener('DOMContentLoaded', initApp);
