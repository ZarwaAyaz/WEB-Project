const mongoose = require('mongoose');

// Product Schema - defines the structure of each product in MongoDB
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    // Short product description (added in Assignment 4 for admin panel)
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    stock: {
        type: Number,
        default: 0
    },
    // Path to the main product image (empty string if no image)
    image: {
        type: String,
        default: ''
    },
    // Path to the hover image for the hover-swap effect (optional)
    hoverImage: {
        type: String,
        default: ''
    },
    // Flag: shown in the "New Arrivals" section on homepage / dedicated page
    isNewArrival: {
        type: Boolean,
        default: false
    },
    // Flag: shown in the "Best Selling" section on homepage / dedicated page
    isBestSelling: {
        type: Boolean,
        default: false
    },
    // Flag: shown on the "On Sale" page — products currently on promotional discount
    isOnSale: {
        type: Boolean,
        default: false
    },
    // Discounted price shown on the On Sale page.
    // If set, this is displayed as the actual selling price;
    // the original `price` is shown struck-through as the "was" price.
    // null means no separate sale price has been defined.
    salePrice: {
        type: Number,
        default: null
    }
});

module.exports = mongoose.model('Product', productSchema);
