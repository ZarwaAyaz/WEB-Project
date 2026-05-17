const express              = require('express');
const router               = express.Router();
const authApiController    = require('../../controllers/api/authApiController');

router.post('/login', authApiController.login);

module.exports = router;
