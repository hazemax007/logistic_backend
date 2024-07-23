const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');


router.post('/user/:userId', supplierController.create);

router.get('/user/:userId', supplierController.findAllForUser);

router.get('/', supplierController.findAll)

router.get('/:id', supplierController.findOne);

router.put('/:id', supplierController.update);

router.delete('/:id', supplierController.delete);

module.exports = router;