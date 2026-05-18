const mongoose = require('mongoose');

// ====================================================
// Order Schema — simple and beginner-friendly
// ====================================================
// An order belongs to one user and contains one or
// more product items, each with a name, price, quantity.
// ====================================================

const orderSchema = new mongoose.Schema({

    // Which user placed this order
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Array of items in the order
    items: [
        {
            product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name:     { type: String,  required: true },
            price:    { type: Number,  required: true },
            quantity: { type: Number,  default: 1,  min: 1 }
        }
    ],

    // Total cost of the order
    totalAmount: {
        type: Number,
        default: 0
    },

    // Customer name provided at checkout (may differ from account name)
    customerName: {
        type: String,
        default: ''
    },

    // Contact number for delivery
    phone: {
        type: String,
        default: ''
    },

    // Delivery address
    address: {
        type: String,
        default: ''
    },

    // Order status
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'delivered'],
        default: 'pending'
    }

}, { timestamps: true }); // adds createdAt and updatedAt automatically

module.exports = mongoose.model('Order', orderSchema);
