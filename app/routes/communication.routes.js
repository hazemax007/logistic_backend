const express = require('express');
const router = express.Router();
const communications = require('../controllers/communication.controller.js');

// Send an email and log communication
router.post('/send-email/:userId/:supplierId', communications.sendEmailAndLog);

// Retrieve all Communications for a specific Supplier
router.get('/supplier/:supplierId', communications.findAllForSupplier);

// Retrieve a single Communication with id
router.get('/:id', communications.findOne);

// Update a Communication with id
router.put('/:id', communications.update);

// Delete a Communication with id
router.delete('/:id', communications.delete);

module.exports = router;
