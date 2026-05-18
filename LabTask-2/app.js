const express         = require('express');
const path            = require('path');
const pageController  = require('./controllers/pageController');

const app  = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// ====================================================
// Routes — logic lives in controllers/pageController.js
// ====================================================
app.get('/',            pageController.homePage);
app.get('/all-products', pageController.allProducts);
app.get('/new-arrivals', pageController.newArrivals);
app.get('/best-selling', pageController.bestSelling);
app.get('/under-1000',   pageController.underOneThousand);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
