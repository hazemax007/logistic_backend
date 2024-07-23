const express = require('express');
const router = express.Router();
const dashController = require('../controllers/dash.controller');

// Define routes
router.get('/fetchOrdersTotalPriceData', dashController.fetchOrdersTotalPriceData);

router.get("/stats", dashController.getDashboardStats);

router.get("/monthly-labels-purchases", dashController.getMonthlyLabelsAndPurchases);

router.get("/purchases-feedback", dashController.getPurchasesByFeedback);

router.get("/labels-weight-range", dashController.getLabelsByWeightRange);

router.get("/top-selling-products", dashController.getTopSellingProducts);


module.exports = router;