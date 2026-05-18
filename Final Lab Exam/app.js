require('dotenv').config(); // Load .env variables before anything else

const express     = require('express');
const path        = require('path');
const mongoose    = require('mongoose');
const session     = require('express-session');
const { MongoStore } = require('connect-mongo');
const flash       = require('connect-flash');

const Product     = require('./models/Product');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes  = require('./routes/authRoutes');
const cartRoutes  = require('./routes/cartRoutes');

// API route modules (LabTask-4 — JWT-based REST API)
const authApiRoutes    = require('./routes/api/authApiRoutes');
const productApiRoutes = require('./routes/api/productApiRoutes');
const userApiRoutes    = require('./routes/api/userApiRoutes');
const orderApiRoutes   = require('./routes/api/orderApiRoutes');

const app  = express();
const PORT = 3000;

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/honey-accessories';
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse form data (needed for POST forms)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
// Sessions are persisted in MongoDB via connect-mongo
// so users stay logged in even if the server restarts
app.use(session({
    secret: process.env.SESSION_SECRET || 'honey-admin-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }), // save sessions in MongoDB
    cookie: { maxAge: 1000 * 60 * 60 * 2 }             // session lasts 2 hours
}));

// Flash messages — must come AFTER session middleware
app.use(flash());

// --- Global locals middleware ---
// Makes these variables available in EVERY EJS template automatically
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    res.locals.success     = req.flash('success');
    res.locals.error       = req.flash('error');
    // Cart item count and map — available in every EJS template
    const cart = req.session.cart || [];
    res.locals.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    // cartMap: { productId: quantity } so views can show +/- controls
    const cartMap = {};
    cart.forEach(item => { cartMap[item.productId] = item.quantity; });
    res.locals.cartMap = cartMap;
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Serve images from the shared root Assets folder
app.use('/assets', express.static(path.join(__dirname, '..', 'Assets')));

// Mount routes
app.use('/admin', adminRoutes);   // admin panel routes
app.use('/', authRoutes);         // register / login / logout / profile
app.use('/', cartRoutes);         // product detail, cart, checkout

// ====================================================
// REST API routes — /api/v1  (LabTask-4)
// These return JSON. JWT authentication only.
// Existing session-based website is NOT affected.
// ====================================================
app.use('/api/v1/auth',     authApiRoutes);    // POST /api/v1/auth/login
app.use('/api/v1/products', productApiRoutes); // GET  /api/v1/products
app.use('/api/v1/user',     userApiRoutes);    // GET  /api/v1/user/profile  (protected)
app.use('/api/v1/orders',   orderApiRoutes);   // POST /api/v1/orders        (protected)

// Home page
app.get('/', async (req, res) => {
    try {
        const bestSellers = await Product.find({ isBestSelling: true }).limit(8);
        const newArrivals = await Product.find({ isNewArrival: true }).limit(4);
        res.render('index', { bestSellers, newArrivals });
    } catch (err) {
        console.error(err);
        res.render('index', { bestSellers: [], newArrivals: [] });
    }
});

// Dynamic products page with pagination, search, and filters
app.get('/products', async (req, res) => {
    try {
        const PAGE_SIZE = 8; // Number of products shown per page

        // Read query parameters from the URL
        const page     = parseInt(req.query.page) || 1;
        const search   = req.query.search   || '';
        const category = req.query.category || '';
        const minPrice = req.query.minPrice || '';
        const maxPrice = req.query.maxPrice || '';

        // Build the MongoDB filter object based on what the user selected
        const filter = {};

        // Search by product name (case-insensitive partial match)
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        // Filter by category (exact match)
        if (category) {
            filter.category = category;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        // Count total products that match the filter (needed for pagination)
        const totalProducts = await Product.countDocuments(filter);
        const totalPages    = Math.ceil(totalProducts / PAGE_SIZE);

        // Fetch only the products for the current page
        const products = await Product.find(filter)
            .skip((page - 1) * PAGE_SIZE)  // skip products from previous pages
            .limit(PAGE_SIZE);              // take only 8 products

        // Get all unique categories for the dropdown filter
        const categories = await Product.distinct('category');

        // Render the products page with all required data
        res.render('products', {
            products,
            currentPage: page,
            totalPages,
            totalProducts,
            search,
            category,
            minPrice,
            maxPrice,
            categories
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong. Please try again.');
    }
});

// Redirect /all-products to the new dynamic /products page
app.get('/all-products', (req, res) => {
    res.redirect('/products');
});

app.get('/new-arrivals', async (req, res) => {
    try {
        const products = await Product.find({ isNewArrival: true });
        res.render('new-arrivals', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong. Please try again.');
    }
});

app.get('/best-selling', async (req, res) => {
    try {
        const products = await Product.find({ isBestSelling: true });
        res.render('best-selling', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong. Please try again.');
    }
});

app.get('/under-1000', async (req, res) => {
    try {
        const products = await Product.find({ price: { $lte: 1000 } }).sort({ price: 1 });
        res.render('under-1000', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong. Please try again.');
    }
});

// On Sale page — fetches ALL products where isOnSale === true in a single DB query.
// The full array is passed to onsale.ejs and jQuery handles showing 10 at a time
// (no extra DB calls, no AJAX — pure client-side DOM pagination).
app.get('/onsale-products', async (req, res) => {
    try {
        const products = await Product.find({ isOnSale: true });
        res.render('onsale', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong. Please try again.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
