const path    = require('path');
const fs      = require('fs');
const Product = require('../models/Product');
const Order   = require('../models/Order');

// GET /admin/login  →  redirect to unified login
exports.showLogin = (req, res) => res.redirect('/login');

// GET /admin/logout  →  redirect to unified logout
exports.showLogout = (req, res) => res.redirect('/logout');

// GET /admin
exports.dashboard = async (req, res) => {
    try {
        const products = await Product.find().sort({ _id: -1 });
        res.render('admin/dashboard', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading dashboard.');
    }
};

// GET /admin/products/add
exports.showAddProduct = (req, res) => {
    res.render('admin/add-product', { error: null });
};

// POST /admin/products/add
exports.addProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        if (!name || !description || !price || !category || !stock) {
            return res.render('admin/add-product', {
                error: 'All fields are required. Please fill in every field.'
            });
        }

        if (isNaN(price) || Number(price) <= 0) {
            return res.render('admin/add-product', {
                error: 'Price must be a valid positive number.'
            });
        }

        if (isNaN(stock) || Number(stock) < 0) {
            return res.render('admin/add-product', {
                error: 'Stock must be a valid non-negative number.'
            });
        }

        let imagePath = '';
        if (req.file) imagePath = '/uploads/' + req.file.filename;

        const onSale = req.body.isOnSale === 'on';

        const newProduct = new Product({
            name:          name.trim(),
            description:   description.trim(),
            price:         Number(price),
            category:      category.trim(),
            stock:         Number(stock),
            image:         imagePath,
            hoverImage:    '',
            isNewArrival:  req.body.isNewArrival  === 'on',
            isBestSelling: req.body.isBestSelling === 'on',
            // isOnSale and salePrice are set together — no sale price without the flag
            isOnSale:      onSale,
            salePrice:     onSale && req.body.salePrice ? Number(req.body.salePrice) : null
        });

        await newProduct.save();
        req.flash('success', `Product "${name}" added successfully!`);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.render('admin/add-product', {
            error: 'Something went wrong while saving the product. Please try again.'
        });
    }
};

// GET /admin/products/edit/:id
exports.showEditProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found.');
        res.render('admin/edit-product', { product, error: null });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading product.');
    }
};

// POST /admin/products/edit/:id
exports.editProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        if (!name || !description || !price || !category || !stock) {
            const product = await Product.findById(req.params.id);
            return res.render('admin/edit-product', { product, error: 'All fields are required.' });
        }

        if (isNaN(price) || Number(price) <= 0) {
            const product = await Product.findById(req.params.id);
            return res.render('admin/edit-product', {
                product,
                error: 'Price must be a valid positive number.'
            });
        }

        const onSale = req.body.isOnSale === 'on';

        const updateData = {
            name:          name.trim(),
            description:   description.trim(),
            price:         Number(price),
            category:      category.trim(),
            stock:         Number(stock),
            isNewArrival:  req.body.isNewArrival  === 'on',
            isBestSelling: req.body.isBestSelling === 'on',
            // Clear salePrice when On Sale is unchecked
            isOnSale:      onSale,
            salePrice:     onSale && req.body.salePrice ? Number(req.body.salePrice) : null
        };

        if (req.file) {
            const oldProduct = await Product.findById(req.params.id);
            if (oldProduct && oldProduct.image && oldProduct.image.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, '..', 'public', oldProduct.image);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.log('Could not delete old image:', err.message);
                });
            }
            updateData.image = '/uploads/' + req.file.filename;
        }

        await Product.findByIdAndUpdate(req.params.id, updateData);
        req.flash('success', `Product "${name}" updated successfully!`);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating product.');
    }
};

// POST /admin/products/delete/:id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found.');

        if (product.image && product.image.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, '..', 'public', product.image);
            fs.unlink(imagePath, (err) => {
                if (err) console.log('Could not delete image file:', err.message);
            });
        }

        await Product.findByIdAndDelete(req.params.id);
        req.flash('success', `Product "${product.name}" deleted successfully.`);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting product.');
    }
};

// GET /admin/orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.render('admin/orders', { orders });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading orders.');
    }
};
