const Order = require('../../models/Order');

// POST /api/v1/orders  (protected — verifyToken applied in route)
exports.createOrder = async (req, res) => {
    try {
        const { items, phone } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order must contain at least one item.'
            });
        }

        for (const item of items) {
            if (!item.name || !item.price) {
                return res.status(400).json({
                    success: false,
                    message: 'Each item must have a name and price.'
                });
            }
        }

        const totalAmount = items.reduce(
            (sum, item) => sum + item.price * (item.quantity || 1),
            0
        );

        const order = await Order.create({
            user: req.user.user_id,
            items,
            totalAmount,
            phone: phone || ''
        });

        res.status(201).json({
            success: true,
            message: 'Order placed successfully.',
            data: order
        });
    } catch (err) {
        console.error('API create order error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};
