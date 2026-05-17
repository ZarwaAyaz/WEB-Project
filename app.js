const express           = require('express');
const path              = require('path');
const mongoose          = require('mongoose');
const productController = require('./controllers/productController');

const app  = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/honey-accessories')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Serve images from the shared root Assets folder
app.use('/assets', express.static(path.join(__dirname, '..', 'Assets')));

// ====================================================
// Routes — logic lives in controllers/productController.js
// ====================================================
app.get('/',            productController.homePage);
app.get('/products',    productController.productsPage);
app.get('/all-products', productController.redirectAllProducts);
app.get('/new-arrivals', productController.newArrivals);
app.get('/best-selling', productController.bestSelling);
app.get('/under-1000',   productController.underOneThousand);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
