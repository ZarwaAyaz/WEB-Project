const express                = require('express');
const router                 = express.Router();
const productApiController   = require('../../controllers/api/productApiController');

router.get('/',    productApiController.getProducts);
router.get('/:id', productApiController.getProductById);

module.exports = router;
