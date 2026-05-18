const Product = require('../models/Product');
const Order   = require('../models/Order');

// GET /products/:id
exports.productDetail = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            req.flash('error', 'Product not found.');
            return res.redirect('/products');
        }
        res.render('product-detail', { product });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong.');
        res.redirect('/products');
    }
};

// POST /cart/add/:id
exports.addToCart = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            req.flash('error', 'Product not found.');
            return res.redirect('/products');
        }

        if (!req.session.cart) req.session.cart = [];

        const existingIndex = req.session.cart.findIndex(
            item => item.productId === req.params.id
        );

        if (existingIndex >= 0) {
            req.session.cart[existingIndex].quantity += 1;
        } else {
            req.session.cart.push({
                productId: req.params.id,
                name:      product.name,
                price:     product.price,
                image:     product.image || '',
                quantity:  1
            });
        }

        req.flash('success', `"${product.name}" added to cart!`);
        const redirectTo = req.body.redirectTo || '/products';
        res.redirect(redirectTo);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Could not add item to cart.');
        res.redirect('/products');
    }
};

// GET /cart
exports.viewCart = (req, res) => {
    const cart       = req.session.cart || [];
    const grandTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.render('cart', { cart, grandTotal });
};

// POST /cart/remove/:id
exports.removeFromCart = (req, res) => {
    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(
            item => item.productId !== req.params.id
        );
    }
    req.flash('success', 'Item removed from cart.');
    res.redirect('/cart');
};

// GET /checkout
exports.checkout = (req, res) => {
    const cart = req.session.cart || [];
    if (cart.length === 0) {
        req.flash('error', 'Your cart is empty. Add some products first!');
        return res.redirect('/products');
    }
    const grandTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.render('checkout', { cart, grandTotal });
};

// POST /checkout/place
exports.placeOrder = async (req, res) => {
    try {
        const cart = req.session.cart || [];

        if (cart.length === 0) {
            req.flash('error', 'Your cart is empty.');
            return res.redirect('/products');
        }

        // Verify stock availability for every item before saving the order
        for (const item of cart) {
            const product = await Product.findById(item.productId).select('stock name');
            if (!product || product.stock < item.quantity) {
                req.flash('error', `Sorry, "${item.name}" only has ${product ? product.stock : 0} left in stock.`);
                return res.redirect('/cart');
            }
        }

        const items = cart.map(item => ({
            product:  item.productId,
            name:     item.name,
            price:    item.price,
            quantity: item.quantity
        }));

        const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        const order = new Order({
            user:         req.session.user.id,
            items,
            totalAmount,
            customerName: (req.body.customerName || '').trim(),
            phone:        (req.body.phone || '').trim(),
            address:      (req.body.address || '').trim()
        });
        await order.save();

        // Deduct stock for every ordered item
        for (const item of items) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } }
            );
        }

        req.session.cart = [];
        req.flash('success', 'Order placed successfully! Thank you for your purchase. 🎉');
        res.redirect('/products');
    } catch (err) {
        console.error('Order save error:', err);
        req.flash('error', 'Could not place order. Please try again.');
        res.redirect('/checkout');
    }
};

// POST /cart/decrease/:id  — decrease qty by 1, remove item when it hits 0
exports.decreaseCartItem = (req, res) => {
    if (req.session.cart) {
        const idx = req.session.cart.findIndex(item => item.productId === req.params.id);
        if (idx >= 0) {
            req.session.cart[idx].quantity -= 1;
            if (req.session.cart[idx].quantity <= 0) {
                req.session.cart.splice(idx, 1);
            }
        }
    }
    const redirectTo = req.body.redirectTo || '/products';
    res.redirect(redirectTo);
};
