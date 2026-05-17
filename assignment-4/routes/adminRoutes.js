const express          = require('express');
const router           = express.Router();
const upload           = require('../middleware/upload');
const { isAdminLoggedIn } = require('../middleware/adminAuth');
const adminController  = require('../controllers/adminController');

// Login / Logout
router.get('/login',  adminController.showLogin);
router.post('/login', adminController.login);
router.get('/logout', adminController.logout);

// Dashboard & CRUD (all protected)
router.get('/',                     isAdminLoggedIn, adminController.dashboard);
router.get('/products/add',         isAdminLoggedIn, adminController.showAddProduct);
router.post('/products/add',        isAdminLoggedIn, upload.single('image'), adminController.addProduct);
router.get('/products/edit/:id',    isAdminLoggedIn, adminController.showEditProduct);
router.post('/products/edit/:id',   isAdminLoggedIn, upload.single('image'), adminController.editProduct);
router.post('/products/delete/:id', isAdminLoggedIn, adminController.deleteProduct);

module.exports = router;
