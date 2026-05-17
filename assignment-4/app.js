const express  = require('express');
const path     = require('path');
const mongoose = require('mongoose');
const session  = require('express-session');

const Product      = require('./models/Product');
const adminRoutes  = require('./routes/adminRoutes');

const app  = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/honey-accessories')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse form data (needed for POST forms)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware — used for admin login
// The secret signs the session cookie so it can't be forged
app.use(session({
    secret: 'honey-admin-secret-key',  // change this in production
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 }  // session lasts 2 hours
}));

app.use(express.static(path.join(__dirname, 'public')));

// Serve images from the shared root Assets folder
app.use('/assets', express.static(path.join(__dirname, '..', 'Assets')));

// Mount admin routes — all /admin/* routes handled here
app.use('/admin', adminRoutes);

// Home page
app.get('/', (req, res) => {
    res.render('index');
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
        const sort     = req.query.sort     || '';

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

        // Build sort object
        let sortObj = {};
        if (sort === 'price_asc')         sortObj = { price: 1 };
        else if (sort === 'price_desc')   sortObj = { price: -1 };
        else if (sort === 'rating_desc')  sortObj = { rating: -1 };
        else if (sort === 'rating_asc')   sortObj = { rating: 1 };
        else sortObj = { _id: -1 }; // default: newest first

        // Count total products that match the filter (needed for pagination)
        const totalProducts = await Product.countDocuments(filter);
        const totalPages    = Math.ceil(totalProducts / PAGE_SIZE);

        // Fetch only the products for the current page
        const products = await Product.find(filter)
            .sort(sortObj)
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
            categories,
            sort
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
