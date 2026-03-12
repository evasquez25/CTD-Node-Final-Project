const express = require('express');
const { getDebts, createDebt, updateDebt, deleteDebt } = require('../controllers/debtController');

const router = express.Router();

// Get all debts for authenticated user
router.get('/', getDebts);

// Create a new debt
router.post('/', createDebt);

// Update a debt
router.put('/:id', updateDebt);

// Delete a debt
router.delete('/:id', deleteDebt);

module.exports = router;
