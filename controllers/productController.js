const Product = require('../models/Product');

// GET /
exports.homePage = (req, res) => {
    res.render('index');
};

// GET /products
exports.productsPage = async (req, res) => {
    try {
        const PAGE_SIZE = 8;

        const page     = parseInt(req.query.page) || 1;
        const search   = req.query.search   || '';
        const category = req.query.category || '';
        const minPrice = req.query.minPrice || '';
        const maxPrice = req.query.maxPrice || '';
        const sort     = req.query.sort     || '';

        const filter = {};

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        if (category) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        let sortObj = {};
        if (sort === 'price_asc')         sortObj = { price: 1 };
        else if (sort === 'price_desc')   sortObj = { price: -1 };
        else if (sort === 'rating_desc')  sortObj = { rating: -1 };
        else if (sort === 'rating_asc')   sortObj = { rating: 1 };
        else sortObj = { _id: -1 };

        const totalProducts = await Product.countDocuments(filter);
        const totalPages    = Math.ceil(totalProducts / PAGE_SIZE);

        const products = await Product.find(filter)
            .sort(sortObj)
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);

        const categories = await Product.distinct('category');

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
};

// GET /all-products  →  redirect to /products
exports.redirectAllProducts = (req, res) => {
    res.redirect('/products');
};

// GET /new-arrivals
exports.newArrivals = async (req, res) => {
    try {
        const products = await Product.find({ isNewArrival: true });
        res.render('new-arrivals', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong. Please try again.');
    }
};

// GET /best-selling
exports.bestSelling = async (req, res) => {
    try {
        const products = await Product.find({ isBestSelling: true });
        res.render('best-selling', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong. Please try again.');
    }
};

// GET /under-1000
exports.underOneThousand = async (req, res) => {
    try {
        const products = await Product.find({ price: { $lte: 1000 } }).sort({ price: 1 });
        res.render('under-1000', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong. Please try again.');
    }
};
