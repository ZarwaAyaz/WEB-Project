const express         = require('express');
const router          = express.Router();
const upload          = require('../middleware/upload');
const { isAdmin }     = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

router.get('/login',  adminController.showLogin);
router.get('/logout', adminController.showLogout);

router.get('/',                     isAdmin, adminController.dashboard);
router.get('/products/add',         isAdmin, adminController.showAddProduct);
router.post('/products/add',        isAdmin, upload.single('image'), adminController.addProduct);
router.get('/products/edit/:id',    isAdmin, adminController.showEditProduct);
router.post('/products/edit/:id',   isAdmin, upload.single('image'), adminController.editProduct);
router.post('/products/delete/:id', isAdmin, adminController.deleteProduct);
router.get('/orders',               isAdmin, adminController.getOrders);

module.exports = router;
