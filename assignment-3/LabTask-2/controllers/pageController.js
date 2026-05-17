// GET /
exports.homePage = (req, res) => res.render('index');

// GET /all-products
exports.allProducts = (req, res) => res.render('all-products');

// GET /new-arrivals
exports.newArrivals = (req, res) => res.render('new-arrivals');

// GET /best-selling
exports.bestSelling = (req, res) => res.render('best-selling');

// GET /under-1000
exports.underOneThousand = (req, res) => res.render('under-1000');
