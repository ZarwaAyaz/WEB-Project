const express            = require('express');
const router             = express.Router();
const { isLoggedIn }     = require('../middleware/authMiddleware');
const cartController     = require('../controllers/cartController');

router.get('/products/:id',       cartController.productDetail);
router.post('/cart/add/:id',      cartController.addToCart);router.post('/cart/decrease/:id', cartController.decreaseCartItem);router.get('/cart',               cartController.viewCart);
router.post('/cart/remove/:id',   cartController.removeFromCart);
router.get('/checkout',           isLoggedIn, cartController.checkout);
router.post('/checkout/place',    isLoggedIn, cartController.placeOrder);

module.exports = router;
