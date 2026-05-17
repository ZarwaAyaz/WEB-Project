const mongoose = require('mongoose');
const Product  = require('../../models/Product');

// GET /api/v1/products
exports.getProducts = async (req, res) => {
    try {
        const PAGE_SIZE = parseInt(req.query.limit)  || 8;
        const page      = parseInt(req.query.page)   || 1;
        const search    = req.query.search   || '';
        const category  = req.query.category || '';
        const minPrice  = req.query.minPrice || '';
        const maxPrice  = req.query.maxPrice || '';

        const filter = {};

        if (search)   filter.name     = { $regex: search, $options: 'i' };
        if (category) filter.category = category;

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const totalProducts = await Product.countDocuments(filter);
        const totalPages    = Math.ceil(totalProducts / PAGE_SIZE);

        const products = await Product.find(filter)
            .select('name price category stock image')
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);

        res.json({
            success: true,
            data: {
                products,
                currentPage:   page,
                totalPages,
                totalProducts
            }
        });
    } catch (err) {
        console.error('API get products error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

// GET /api/v1/products/:id
exports.getProductById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format.'
            });
        }

        const product = await Product.findById(req.params.id)
            .select('name price category stock image description rating');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }

        res.json({ success: true, data: product });
    } catch (err) {
        console.error('API get product by ID error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};
