const Payment = require('../models/Payment');
const Debt = require('../models/Debt');
const jwt = require('jsonwebtoken');

// Helper function to get user from JWT token
const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No valid token provided');
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Get all payments for a user
const getPayments = async (req, res, next) => {
  try {
    const userId = getUserFromToken(req);
    const payments = await Payment.find({ user: userId }).sort({ createdAt: -1 });
    
    // Format payments to match frontend structure
    const formattedPayments = payments.map(payment => ({
      'Tipo': payment.type,
      'Categoría': payment.category,
      'Cantidad': payment.amount,
      'Fecha': payment.paymentDate.toLocaleDateString('en-US'),
      'Notas': payment.notes || ''
    }));
    
    res.json(formattedPayments);
  } catch (error) {
    console.error('Error in getPayments:', error);
    if (error.message.includes('token')) {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

// Create a new payment
const createPayment = async (req, res, next) => {
  try {
    const userId = getUserFromToken(req);
    const { type, category, amount, date, notes, debtId } = req.body;
    
    if (!type || !category || !amount || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const payment = await Payment.create({
      type,
      category,
      amount: Number(amount),
      paymentDate: new Date(date),
      notes,
      debtId: debtId || null,
      user: userId
    });
    
    // If this is a debt payment, update the debt
    if (type === 'Debt' && debtId) {
      const debt = await Debt.findById(debtId);
      if (!debt) {
        return res.status(404).json({ error: 'Debt not found' });
      }
      
      // Update totalPaid and recalculate remaining
      debt.totalPaid += Number(amount);
      debt.remaining = debt.total - debt.totalPaid;
      debt.isPaid = debt.remaining <= 0;
      
      await debt.save();
    }
    
    res.status(201).json({
      message: 'Payment created successfully',
      payment
    });
  } catch (error) {
    console.error('Error in createPayment:', error);
    if (error.message.includes('token')) {
      return res.status(401).json({ error: error.message });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

// Update a payment
const updatePayment = async (req, res, next) => {
  try {
    const userId = getUserFromToken(req);
    const { id } = req.params;
    
    const payment = await Payment.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json({
      message: 'Payment updated successfully',
      payment
    });
  } catch (error) {
    console.error('Error in updatePayment:', error);
    if (error.message.includes('token')) {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update payment' });
  }
};

// Delete a payment
const deletePayment = async (req, res, next) => {
  try {
    const userId = getUserFromToken(req);
    const { id } = req.params;
    
    const payment = await Payment.findOneAndDelete({ _id: id, user: userId });
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json({
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('Error in deletePayment:', error);
    if (error.message.includes('token')) {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to delete payment' });
  }
};

module.exports = {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment
};
