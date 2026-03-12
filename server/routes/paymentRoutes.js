const express = require('express');
const { getPayments, createPayment, updatePayment, deletePayment } = require('../controllers/paymentController');

const router = express.Router();

// Get all payments for authenticated user
router.get('/', getPayments);

// Create a new payment
router.post('/', createPayment);

// Update a payment
router.put('/:id', updatePayment);

// Delete a payment
router.delete('/:id', deletePayment);

module.exports = router;
