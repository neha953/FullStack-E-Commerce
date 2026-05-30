const API = 'http://localhost:8080/api';
let currentUser = null;
let cart = [];
let allProducts = [];
let currentCategory = 'all';
let selectedProductId = null;
let discount = 0;

const COUPONS = {
    'NEHA10': 10,
    'KASHISH20': 20,
    'SHOPNK15': 15,
    'SAVE50': 50
};

function showPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page).classList.add('active');
    if (page === 'products') loadProducts();
    if (page === 'orders') loadOrders();
    if (page === 'admin') loadAdminData();
    if (page === 'cart') showCart();
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const msg = document.getElementById('loginMsg');
    try {
        const res = await fetch(`${API}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
            currentUser = data;
            updateNavbar();
            showPage('products');
            showToast(`Welcome back, ${data.name}!`);
        } else {
            msg.className = 'msg error';
            msg.textContent = 'Invalid email or password!';
        }
    } catch (e) {
        msg.className = 'msg error';
        msg.textContent = 'Server not running!';
    }
}

async function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const msg = document.getElementById('registerMsg');
    try {
        const res = await fetch(`${API}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (data.success) {
            msg.className = 'msg success';
            msg.textContent = 'Account created! Please login.';
            setTimeout(() => showPage('login'), 1500);
        } else {
            msg.className = 'msg error';
            msg.textContent = 'Email already exists!';
        }
    } catch (e) {
        msg.className = 'msg error';
        msg.textContent = 'Server not running!';
    }
}

function logout() {
    currentUser = null;
    cart = [];
    discount = 0;
    updateNavbar();
    showPage('home');
    showToast('Logged out successfully!');
}

function updateNavbar() {
    const isLoggedIn = currentUser !== null;
    const isAdmin = isLoggedIn && currentUser.role === 'admin';
    document.getElementById('loginBtn').style.display = isLoggedIn ? 'none' : 'inline-block';
    document.getElementById('registerBtn').style.display = isLoggedIn ? 'none' : 'inline-block';
    document.getElementById('logoutBtn').style.display = isLoggedIn ? 'inline-block' : 'none';
    document.getElementById('ordersBtn').style.display = isLoggedIn && !isAdmin ? 'inline-block' : 'none';
    document.getElementById('adminBtn').style.display = isAdmin ? 'inline-block' : 'none';
    document.getElementById('cartBtn').style.display = isLoggedIn && !isAdmin ? 'inline-block' : 'none';
    document.getElementById('welcomeMsg').textContent = isLoggedIn ? `👋 Hi, ${currentUser.name}!` : '';
    updateCartBadge();
}

async function loadProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '<p style="text-align:center;padding:3rem;color:#878787">Loading products...</p>';
    try {
        const res = await fetch(`${API}/products`);
        allProducts = await res.json();
        renderProducts(allProducts);
    } catch (e) {
        grid.innerHTML = '<p style="color:red;text-align:center;padding:2rem">Could not load products. Is the server running?</p>';
    }
}

function getEmoji(product) {
    const emojiMap = {
        'Laptop': '💻', 'MacBook Pro': '💻', 'Monitor': '🖥️',
        'Phone': '📱', 'iPad': '📱',
        'Headphones': '🎧', 'Smart Watch': '⌚',
        'Keyboard': '⌨️', 'Mouse': '🖱️', 'Webcam': '📷',
        'T-Shirt': '👕', 'Hoodie': '🧥', 'Jeans': '👖',
        'Sneakers': '👟', 'Backpack': '🎒', 'Sunglasses': '🕶️',
        'Java Book': '📗', 'Python Book': '📘',
        'DSA Book': '📙', 'UI/UX Book': '📚', 'Chair': '🪑'
    };
    const catDefault = { 1: '💻', 2: '👕', 3: '📚' };
    return emojiMap[product.name] || catDefault[product.categoryId] || '🛍️';
}

function getMRP(price) { return Math.round(price * 1.3); }
function getDiscountPct(price) { return Math.round(((getMRP(price) - price) / getMRP(price)) * 100); }

function renderProducts(products) {
    const grid = document.getElementById('productGrid');
    if (products.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:#878787;padding:2rem;background:white">No products found!</p>';
        return;
    }
    const ratings = [4.1, 4.2, 4.3, 4.4, 4.5, 3.9, 4.6, 4.7, 4.3, 4.1];
    const reviewCounts = [1243, 892, 2341, 567, 3421, 234, 1876, 445, 987, 1654];
    grid.innerHTML = products.map((p, i) => {
        const emoji = getEmoji(p);
        const mrp = getMRP(p.price);
        const disc = getDiscountPct(p.price);
        const rating = ratings[i % ratings.length];
        const reviewCount = reviewCounts[i % reviewCounts.length];
        const shortDesc = p.description ? p.description.substring(0, 60) + '...' : '';
        return `
        <div class="product-card" onclick="openProductModal(${p.id})">
            <div class="product-emoji">${emoji}</div>
            <h3>${p.name}</h3>
            <p style="color:#878787;font-size:0.75rem;margin-bottom:6px;line-height:1.4">${shortDesc}</p>
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
                <span class="rating-badge">★ ${rating}</span>
                <span style="font-size:0.72rem;color:#878787">(${reviewCount.toLocaleString()})</span>
            </div>
            <div class="product-price">Rs. ${p.price.toLocaleString()}</div>
            <div style="margin-bottom:4px">
                <span class="product-mrp">Rs. ${mrp.toLocaleString()}</span>
                <span class="product-discount">${disc}% off</span>
            </div>
            <div class="product-stock">Stock: ${p.stockQty} units</div>
            <button onclick="event.stopPropagation();addToCart(${JSON.stringify(p).replace(/"/g, '&quot;')})"
                    class="btn-primary btn-full"
                    style="margin-top:10px;font-size:0.82rem;padding:10px">
                ADD TO CART
            </button>
        </div>`;
    }).join('');
}

function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    let filtered = allProducts;
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.categoryId === currentCategory);
    }
    filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query))
    );
    renderProducts(filtered);
}

function filterCategory(catId) {
    currentCategory = catId;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`filter-${catId}`).classList.add('active');
    const query = document.getElementById('searchInput').value.toLowerCase();
    let filtered = allProducts;
    if (catId !== 'all') filtered = filtered.filter(p => p.categoryId === catId);
    if (query) filtered = filtered.filter(p => p.name.toLowerCase().includes(query));
    renderProducts(filtered);
}

async function openProductModal(productId) {
    selectedProductId = productId;
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    const emoji = getEmoji(product);
    const mrp = getMRP(product.price);
    const disc = getDiscountPct(product.price);
    const ratings = [4.1, 4.2, 4.3, 4.4, 4.5, 3.9, 4.6, 4.7];
    const reviewCounts = [1243, 892, 2341, 567, 3421, 234, 1876, 445];
    const rating = ratings[product.id % ratings.length];
    const reviewCount = reviewCounts[product.id % reviewCounts.length];

    document.getElementById('modalProductInfo').innerHTML = `
        <div style="font-size:4rem;text-align:center;margin-bottom:1rem;background:#f1f3f6;padding:1.5rem;border-radius:4px">${emoji}</div>
        <h3 style="font-size:1.1rem;font-weight:600;color:#212121;margin-bottom:6px">${product.name}</h3>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
            <span class="rating-badge">★ ${rating}</span>
            <span style="font-size:0.78rem;color:#878787">${reviewCount.toLocaleString()} ratings</span>
        </div>
        <div style="background:#f1f3f6;border-radius:4px;padding:10px 12px;margin-bottom:12px;font-size:0.82rem;color:#555;line-height:1.7">
            ${product.description || 'No description available.'}
        </div>
        <div style="font-size:1.4rem;font-weight:700;color:#212121;margin-bottom:4px">Rs. ${product.price.toLocaleString()}</div>
        <div style="margin-bottom:4px">
            <span style="color:#878787;text-decoration:line-through;font-size:0.85rem">M.R.P: Rs. ${mrp.toLocaleString()}</span>
            <span style="color:#388e3c;font-weight:600;font-size:0.85rem;margin-left:6px">(${disc}% off)</span>
        </div>
        <p style="color:#388e3c;font-size:0.82rem;margin-bottom:4px">✓ FREE Delivery on orders above Rs. 500</p>
        <p style="color:#388e3c;font-size:0.82rem;margin-bottom:12px">✓ In Stock — ${product.stockQty} units available</p>
        <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')});closeProductModal()"
                class="btn-primary btn-full"
                style="font-size:0.9rem;padding:12px;letter-spacing:0.5px">
            ADD TO CART
        </button>
    `;

    try {
        const res = await fetch(`${API}/reviews/${productId}`);
        const reviews = await res.json();
        if (reviews.length === 0) {
            document.getElementById('modalReviews').innerHTML =
                '<p style="color:#878787;font-size:0.85rem;padding:8px 0">No reviews yet — be the first!</p>';
        } else {
            document.getElementById('modalReviews').innerHTML = reviews.map(r => `
                <div class="review-item">
                    <div class="review-stars">${'⭐'.repeat(r.rating)}</div>
                    <p style="margin-top:4px;color:#212121;font-size:0.85rem">${r.comment || ''}</p>
                    <small style="color:#878787">— ${r.userName || 'Customer'}</small>
                </div>
            `).join('');
        }
    } catch (e) {
        document.getElementById('modalReviews').innerHTML =
            '<p style="color:#878787;font-size:0.85rem">No reviews yet!</p>';
    }

    document.getElementById('reviewForm').style.display =
        currentUser && currentUser.role === 'customer' ? 'block' : 'none';
    document.getElementById('productModal').style.display = 'flex';
}

function closeProductModal() {
    document.getElementById('productModal').style.display = 'none';
}

async function submitReview() {
    if (!currentUser) return;
    const rating = document.getElementById('reviewRating').value;
    const comment = document.getElementById('reviewComment').value;
    try {
        await fetch(`${API}/reviews/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id.toString(),
                productId: selectedProductId.toString(),
                rating, comment
            })
        });
        document.getElementById('reviewComment').value = '';
        showToast('Review submitted!');
        openProductModal(selectedProductId);
    } catch (e) {
        alert('Failed to submit review!');
    }
}

function applyCoupon() {
    const code = document.getElementById('couponInput').value.toUpperCase().trim();
    const msg = document.getElementById('couponMsg');
    if (COUPONS[code]) {
        discount = COUPONS[code];
        msg.textContent = `✅ ${discount}% discount applied!`;
        msg.style.color = '#388e3c';
        showToast(`Coupon applied! ${discount}% off!`);
        showCart();
    } else {
        discount = 0;
        msg.textContent = '❌ Invalid coupon code!';
        msg.style.color = '#c62828';
    }
}

function addToCart(product) {
    if (!currentUser) { showPage('login'); return; }
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartBadge();
    showToast(`${product.name} added to cart!`);
}

function updateCartBadge() {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cartBadge');
    badge.textContent = total;
    badge.style.display = total > 0 ? 'inline-block' : 'none';
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 2500);
}

function showCart() {
    const container = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');
    if (cart.length === 0) {
        container.innerHTML = `
            <div style="background:white;padding:3rem;text-align:center;color:#878787">
                <p style="font-size:1.1rem;margin-bottom:8px">Your cart is empty!</p>
                <small>Add items to get started</small>
            </div>`;
        summary.innerHTML = '';
        return;
    }
    let subtotal = 0;
    container.innerHTML = cart.map((item, i) => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        return `
        <div class="cart-item">
            <div class="cart-item-info">
                <strong style="font-size:0.9rem">${getEmoji(item)} ${item.name}</strong>
                <span style="color:#878787;font-size:0.78rem">Rs. ${item.price.toLocaleString()} per item</span>
                <span style="color:#388e3c;font-size:0.75rem;font-weight:600">In Stock</span>
            </div>
            <div class="cart-item-controls">
                <button onclick="changeQty(${i}, -1)" class="qty-btn">−</button>
                <span class="qty-num">${item.qty}</span>
                <button onclick="changeQty(${i}, 1)" class="qty-btn">+</button>
                <span style="font-weight:700;min-width:100px;text-align:right;color:#212121">
                    Rs. ${itemTotal.toLocaleString()}
                </span>
                <button onclick="removeFromCart(${i})" class="remove-btn">Remove</button>
            </div>
        </div>`;
    }).join('');

    const discountAmount = Math.round((subtotal * discount) / 100);
    const total = subtotal - discountAmount;

    summary.innerHTML = `
        <div class="cart-total">
            <p style="font-size:0.82rem;color:#878787;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:1rem">Price Details</p>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.9rem">
                <span>Price (${cart.reduce((s,i)=>s+i.qty,0)} items)</span>
                <span>Rs. ${subtotal.toLocaleString()}</span>
            </div>
            ${discount > 0 ? `
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.9rem;color:#388e3c">
                <span>Coupon Discount (${discount}%)</span>
                <span>− Rs. ${discountAmount.toLocaleString()}</span>
            </div>` : ''}
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.9rem;color:#388e3c">
                <span>Delivery Charges</span><span>FREE</span>
            </div>
            <div style="border-top:1px dashed #e0e0e0;padding-top:10px;margin-top:10px;display:flex;justify-content:space-between;font-size:1.1rem;font-weight:700">
                <span>Total Amount</span><span>Rs. ${total.toLocaleString()}</span>
            </div>
            ${discount > 0 ? `<p style="color:#388e3c;font-size:0.82rem;margin-top:8px">You save Rs. ${discountAmount.toLocaleString()} on this order!</p>` : ''}
        </div>
        <button onclick="placeCartOrder(${total})" class="btn-primary btn-full"
                style="font-size:1rem;padding:14px;border-radius:2px;letter-spacing:1px;margin-top:1rem">
            PLACE ORDER
        </button>`;
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCartBadge();
    showCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartBadge();
    showCart();
}

async function placeCartOrder(total) {
    if (cart.length === 0) return;
    try {
        const res = await fetch(`${API}/orders/place`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id.toString(),
                addressId: '1',
                total: total.toString()
            })
        });
        const data = await res.json();
        if (data.success) {
            cart = [];
            discount = 0;
            updateCartBadge();
            showToast('Order placed successfully!');
            setTimeout(() => showPage('orders'), 1000);
        } else {
            alert('Order failed!');
        }
    } catch (e) {
        alert('Server not running!');
    }
}

async function loadOrders() {
    if (!currentUser) return;
    const list = document.getElementById('ordersList');
    list.innerHTML = '<p style="text-align:center;color:#878787;padding:2rem">Loading...</p>';
    try {
        const res = await fetch(`${API}/orders/${currentUser.id}`);
        const orders = await res.json();
        if (orders.length === 0) {
            list.innerHTML = `
                <div style="background:white;padding:3rem;text-align:center;color:#878787">
                    <p style="font-size:1.1rem;margin-bottom:8px">No orders yet!</p>
                    <small>Start shopping to see your orders here</small>
                </div>`;
            return;
        }
        list.innerHTML = orders.map(o => {
            const statusClass = `status-${o.status}`;
            const statusEmoji = { pending:'⏳', processing:'⚙️', shipped:'🚚', delivered:'✅' };
            return `
            <div class="order-card">
                <div>
                    <strong style="font-size:1rem">Order #${o.id}</strong>
                    <p style="color:#878787;font-size:0.8rem;margin-top:4px">📅 ${o.createdAt}</p>
                    <p style="font-weight:700;margin-top:4px;font-size:1rem;color:#212121">
                        Rs. ${o.totalAmount.toLocaleString()}
                    </p>
                </div>
                <span class="order-status ${statusClass}">
                    ${statusEmoji[o.status] || '📦'} ${o.status.toUpperCase()}
                </span>
            </div>`;
        }).join('');
    } catch (e) {
        list.innerHTML = '<p style="color:red;padding:1rem">Could not load orders.</p>';
    }
}

function showAdminTab(tab) {
    document.querySelectorAll('.admin-tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`adminTab-${tab}`).style.display = 'block';
    document.getElementById(`tab-${tab}`).classList.add('active');
    if (tab === 'orders') loadAdminOrders();
    if (tab === 'users') loadAdminUsers();
}

async function loadAdminData() {
    if (!currentUser || currentUser.role !== 'admin') return;
    try {
        const [pRes, uRes] = await Promise.all([
            fetch(`${API}/products`),
            fetch(`${API}/users`)
        ]);
        const products = await pRes.json();
        const users = await uRes.json();

        document.getElementById('adminStats').innerHTML = `
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                <div style="background:#e8f4fd;border-radius:4px;padding:1rem;text-align:center;border-left:4px solid #2874f0">
                    <div style="font-size:1.8rem;font-weight:700;color:#2874f0">${products.length}</div>
                    <div style="font-size:0.78rem;color:#878787">Products</div>
                </div>
                <div style="background:#fff3e0;border-radius:4px;padding:1rem;text-align:center;border-left:4px solid #fb641b">
                    <div style="font-size:1.8rem;font-weight:700;color:#fb641b">${users.length}</div>
                    <div style="font-size:0.78rem;color:#878787">Users</div>
                </div>
            </div>`;

        const cats = { 1: 0, 2: 0, 3: 0 };
        products.forEach(p => cats[p.categoryId] = (cats[p.categoryId] || 0) + 1);
        const maxCat = Math.max(...Object.values(cats));
        const catColors = { 1: '#2874f0', 2: '#fb641b', 3: '#388e3c' };
        const catNames = { 1: 'Electronics', 2: 'Clothing', 3: 'Books' };

        document.getElementById('salesChart').innerHTML = Object.keys(cats).map(k => `
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
                <span style="font-size:0.75rem;font-weight:700;color:#212121">${cats[k]}</span>
                <div style="width:100%;height:${(cats[k]/maxCat)*80}px;background:${catColors[k]};border-radius:2px 2px 0 0"></div>
            </div>`).join('');

        document.getElementById('salesLabels').innerHTML = Object.keys(cats).map(k => `
            <div style="flex:1;text-align:center;font-size:0.7rem;color:#878787">${catNames[k]}</div>`).join('');

        document.getElementById('adminProductList').innerHTML = products.map(p => `
            <div class="admin-product-item">
                <div>
                    <strong style="font-size:0.85rem">${getEmoji({name:p.name,categoryId:p.categoryId})} ${p.name}</strong>
                    <span style="color:#878787;font-size:0.75rem;display:block">Rs. ${p.price.toLocaleString()} | Stock: ${p.stockQty}</span>
                </div>
                <button onclick="deleteProduct(${p.id})"
                        style="background:#ff6161;color:white;border:none;padding:5px 12px;border-radius:2px;cursor:pointer;font-size:0.78rem;font-weight:600">
                    DELETE
                </button>
            </div>`).join('');
    } catch (e) {}
}

async function loadAdminUsers() {
    try {
        const res = await fetch(`${API}/users`);
        const users = await res.json();
        document.getElementById('adminUserList').innerHTML = users.map(u => `
            <div class="user-item">
                <strong style="font-size:0.85rem">${u.name}</strong>
                — <span style="color:#878787;font-size:0.82rem">${u.email}</span>
                <span style="float:right;background:${u.role==='admin'?'#e8f4fd':'#e8f5e9'};color:${u.role==='admin'?'#2874f0':'#2e7d32'};padding:2px 8px;border-radius:2px;font-size:0.75rem;font-weight:600;text-transform:uppercase">
                    ${u.role}
                </span>
            </div>`).join('');
    } catch (e) {}
}

async function loadAdminOrders() {
    try {
        const res = await fetch(`${API}/orders/all`);
        const orders = await res.json();
        document.getElementById('adminOrderList').innerHTML = orders.map(o => `
            <div class="admin-product-item">
                <div>
                    <strong style="font-size:0.85rem">Order #${o.id}</strong>
                    <span style="color:#878787;font-size:0.75rem;display:block">
                        User ID: ${o.userId} | Rs. ${o.totalAmount.toLocaleString()}
                    </span>
                </div>
                <select onchange="updateOrderStatus(${o.id}, this.value)"
                        style="padding:5px;border-radius:2px;border:1px solid #e0e0e0;font-size:0.78rem;cursor:pointer">
                    <option ${o.status==='pending'?'selected':''} value="pending">⏳ Pending</option>
                    <option ${o.status==='processing'?'selected':''} value="processing">⚙️ Processing</option>
                    <option ${o.status==='shipped'?'selected':''} value="shipped">🚚 Shipped</option>
                    <option ${o.status==='delivered'?'selected':''} value="delivered">✅ Delivered</option>
                </select>
            </div>`).join('');
    } catch (e) {}
}

async function updateOrderStatus(orderId, status) {
    try {
        await fetch(`${API}/orders/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: orderId.toString(), status })
        });
        showToast('Order status updated!');
    } catch (e) {}
}

async function addProduct() {
    const name = document.getElementById('adminProductName').value;
    const desc = document.getElementById('adminProductDesc').value;
    const price = document.getElementById('adminProductPrice').value;
    const stock = document.getElementById('adminProductStock').value;
    const catId = document.getElementById('adminProductCat').value;
    const msg = document.getElementById('adminMsg');
    if (!name || !price || !stock) {
        msg.className = 'msg error';
        msg.textContent = 'Please fill all fields!';
        return;
    }
    try {
        const res = await fetch(`${API}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description: desc, price, stock, categoryId: catId })
        });
        const data = await res.json();
        if (data.success) {
            msg.className = 'msg success';
            msg.textContent = 'Product added successfully!';
            document.getElementById('adminProductName').value = '';
            document.getElementById('adminProductDesc').value = '';
            document.getElementById('adminProductPrice').value = '';
            document.getElementById('adminProductStock').value = '';
            loadAdminData();
        }
    } catch (e) {
        msg.className = 'msg error';
        msg.textContent = 'Failed!';
    }
}

async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    try {
        const res = await fetch(`${API}/products/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        const data = await res.json();
        if (data.success) {
            showToast('Product deleted!');
            loadAdminData();
        } else {
            alert('Cannot delete! This product has orders attached to it.');
        }
    } catch (e) {
        alert('Server error!');
    }
}