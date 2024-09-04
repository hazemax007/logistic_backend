const express = require('express');
const router = express.Router();
const statsController = require('../controllers/dashboard.controller');


router.get('/stats', statsController.getDashboardStats);

router.get('/totalSalesValue', statsController.totalSalesValue)

router.get('/NumbDeliveredOrders', statsController.numbDeliveredOrders)

router.get('/orderStatusDistribution', statsController.orderStatusDistribution)

router.get('/getOrdersByStatus/:status', statsController.getOrdersByStatus)             

router.get('/salesOverTime', statsController.salesOverTime)

router.get('/topProductsBySales', statsController.getTopProductsBySales)

router.get('/topProductsByQuantity', statsController.getTopProductsByQuantity)

router.get('/getProductStockLevels', statsController.getProductStockLevels)

router.get('/getProductCategories', statsController.getProductCategories)

router.get('/getProductsByCategory/:category', statsController.getProductsByCategory)

router.get('/getUpcomingExpiryProducts', statsController.getUpcomingExpiryProducts)

router.get('/getSalesByStore', statsController.getSalesByStore)

router.get('/getProductAvailabilityByStore', statsController.getProductAvailabilityByStore)

router.get('/getPurchaseFeedback', statsController.getPurchaseFeedback)

router.get('/getPurchaseHistory', statsController.getPurchaseHistory)

router.get('/getCustomerDemographics', statsController.getCustomerDemographics)

router.get('/getTopCustomers', statsController.getTopCustomers)

module.exports = router;
