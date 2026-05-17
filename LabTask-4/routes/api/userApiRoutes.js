const express            = require('express');
const router             = express.Router();
const verifyToken        = require('../../middleware/verifyToken');
const userApiController  = require('../../controllers/api/userApiController');

router.get('/profile', verifyToken, userApiController.getProfile);

module.exports = router;
