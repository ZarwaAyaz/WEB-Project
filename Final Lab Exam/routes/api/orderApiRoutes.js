const express             = require('express');
const router              = express.Router();
const verifyToken         = require('../../middleware/verifyToken');
const orderApiController  = require('../../controllers/api/orderApiController');

router.post('/', verifyToken, orderApiController.createOrder);

module.exports = router;
