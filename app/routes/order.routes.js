const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { order } = require('../models');

// Define routes
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/:userId', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);
//router.put('/:orderId/status', orderController.updateOrderStatus);
router.get('/:orderId/status', orderController.getOrderStatus);
router.get('/generate-invoice/:orderId', orderController.generateInvoice)
router.put('/:id/status', orderController.updateOrderStatus)

module.exports = router;