const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middlewares/upload');

// Define routes
router.post('/', upload.single('image'), productController.createProduct);
router.post('/create', upload.single('image'), productController.createProductt);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/update-store-product-quantity', productController.updateStoreProductQuantity);

module.exports = router;