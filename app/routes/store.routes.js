const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');
const upload = require('../middlewares/upload');

router.post('/', upload.single('image'), storeController.createStore);
router.get('/', storeController.getAllStores);
router.get('/:id', storeController.getStoreById);
router.put('/:id',upload.single('image'), storeController.updateStore);
router.delete('/:id', storeController.deleteStore);
router.post("/assign-products/:storeId", storeController.assignProductsToStore);
router.delete('/:storeId/products/:productId', storeController.deleteProductFromStore);

module.exports = router;