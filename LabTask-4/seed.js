const mongoose = require('mongoose');
const Product = require('./models/Product');

// 25 sample products across 5 categories for testing pagination and filtering
// image      = main product image
// hoverImage = second image shown on mouse hover (same scheme as existing assignments)
const products = [
    // ---- Rings (5) ----
    { name: 'Elise Vintage Ring',           price: 1100, category: 'Rings',            rating: 4.5, stock: 0,
      image: '/assets/Elise Vintage Ring.webp',               hoverImage: '',          isBestSelling: true },

    { name: 'Cosmina Ring',                 price: 1450, category: 'Rings',            rating: 4.3, stock: 5,
      image: '/assets/Cosmina Ring.webp',                     hoverImage: '',          isBestSelling: true },

    { name: 'Pearl Stackable Ring',         price: 850,  category: 'Rings',            rating: 4.0, stock: 10,
      image: '/assets/Pearl Stackabe ring.webp',              hoverImage: '' },

    { name: 'Gold Twisted Band Ring',       price: 950,  category: 'Rings',            rating: 4.2, stock: 8,
      image: '/assets/Gold Twisted Band Ring.webp',           hoverImage: '' },

    { name: 'Crystal Statement Ring',       price: 1250, category: 'Rings',            rating: 4.6, stock: 3,
      image: '/assets/Crystal Statement Ring.webp',           hoverImage: '' },

    // ---- Necklaces (5) ----
    { name: 'Solid Heart Necklace',         price: 1550, category: 'Necklaces',        rating: 4.7, stock: 12,
      image: '/assets/Solid Heart Necklace.webp',             hoverImage: '',                                          isBestSelling: true },

    { name: 'Mini Pink Shell Necklace',     price: 1800, category: 'Necklaces',        rating: 4.4, stock: 6,
      image: '/assets/Mini Pink Shell Necklace.webp',         hoverImage: '/assets/Mini Pink Shell Necklace 2.webp',   isNewArrival: true },

    { name: 'Pink Silver Necklace',         price: 2100, category: 'Necklaces',        rating: 4.8, stock: 4,
      image: '/assets/Pink Silver Necklace.webp',             hoverImage: '/assets/Pink silver Necklace 2.webp',       isNewArrival: true },

    { name: 'Minimalist Bar Necklace',      price: 900,  category: 'Necklaces',        rating: 4.1, stock: 15,
      image: '/assets/Minimalistic Bar Necklace.webp',        hoverImage: '' },

    { name: 'Star Pendant Necklace',        price: 1350, category: 'Necklaces',        rating: 4.3, stock: 9,
      image: '/assets/Star pendant Necklace.webp',            hoverImage: '' },

    // ---- Bracelets (5) ----
    { name: 'Nola Bracelet',                price: 1690, category: 'Bracelets',        rating: 4.6, stock: 7,
      image: '/assets/Nola Bracelet.webp',                    hoverImage: '',          isBestSelling: true },

    { name: 'Be Grateful Bracelet',         price: 1550, category: 'Bracelets',        rating: 4.5, stock: 11,
      image: '/assets/Be Grateful Bracelet.webp',             hoverImage: '',          isBestSelling: true },

    { name: 'Chain Bracelet',               price: 1350, category: 'Bracelets',        rating: 4.2, stock: 14,
      image: '/assets/Chain Bracelet.webp',                   hoverImage: '',          isBestSelling: true },

    { name: 'Pearl Bead Bracelet',          price: 980,  category: 'Bracelets',        rating: 4.0, stock: 20,
      image: '/assets/Pearl Bead Bracelet.webp',              hoverImage: '' },

    { name: 'Gold Charm Bracelet',          price: 2250, category: 'Bracelets',        rating: 4.7, stock: 3,
      image: '/assets/Gold Charm Bracelet.webp',              hoverImage: '' },

    // ---- Earrings (7) ----
    { name: 'Encrusted Hoops',              price: 1950, category: 'Earrings',         rating: 4.4, stock: 0,
      image: '/assets/Encrusted Hoops.webp',                  hoverImage: '',                                          isBestSelling: true },

    { name: 'Hailey Bieber Bottega Gold Hoops', price: 1900, category: 'Earrings',     rating: 4.8, stock: 5,
      image: '/assets/Hailey Bieber Bottega Gold Hoops.webp', hoverImage: '',                                          isBestSelling: true },

    { name: 'Purple Bouqet Earrings',       price: 1150, category: 'Earrings',         rating: 4.5, stock: 12,
      image: '/assets/Purple Bouqet Earring.webp',            hoverImage: '/assets/Purple Bouqet Earrings 2.webp',     isNewArrival: true },

    { name: 'Confetti Butterfly Earrings',  price: 750,  category: 'Earrings',         rating: 4.1, stock: 18,
      image: '/assets/Confetti Butterfly Earring.webp',       hoverImage: '/assets/Confetti Butterfly Earrings 2.webp', isNewArrival: true },

    { name: 'Gold Huggie Hoops',            price: 1600, category: 'Earrings',         rating: 4.6, stock: 8,
      image: '/assets/Gold Huggie Hoops.webp',                hoverImage: '' },

    { name: 'Chandelier Drop Earrings',     price: 2800, category: 'Earrings',         rating: 4.3, stock: 2,
      image: '/assets/Chandelier Drop Earrings.webp',         hoverImage: '' },

    { name: 'Tiny Heart Studs',             price: 650,  category: 'Earrings',         rating: 4.0, stock: 25,
      image: '/assets/Tiny Heart Studs.webp',                 hoverImage: '' },

    // ---- Hair Accessories (3) ----
    { name: 'Pearl Hair Clip',              price: 590,  category: 'Hair Accessories', rating: 4.2, stock: 15,
      image: '/assets/Pearl Hair Clip.webp',                  hoverImage: '' },

    { name: 'Crystal Butterfly Pin',        price: 750,  category: 'Hair Accessories', rating: 4.4, stock: 10,
      image: '/assets/Crystal Butterfly Pin.webp',            hoverImage: '' },

    { name: 'Gold Scrunchie Set',           price: 850,  category: 'Hair Accessories', rating: 4.1, stock: 20,
      image: '/assets/Gold Scrunchie Set.jpg',                hoverImage: '' }
];

// Connect to MongoDB and insert the products
mongoose.connect('mongodb://localhost:27017/honey-accessories')
    .then(async () => {
        console.log('Connected to MongoDB');

        // Remove any existing products first
        await Product.deleteMany({});
        console.log('Cleared old products');

        // Insert all sample products
        await Product.insertMany(products);
        console.log(`Successfully seeded ${products.length} products!`);

        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Seeding error:', err);
        process.exit(1);
    });
