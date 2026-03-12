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

// Get all debts for a user
const getDebts = async (req, res, next) => {
  try {
    const userId = getUserFromToken(req);
    const debts = await Debt.find({ user: userId }).sort({ createdAt: -1 });
    
    // Format debts to match frontend structure
    const formattedDebts = debts.map(debt => ({
      '_id': debt._id,
      'Nombre': debt.name,
      'Total': debt.total,
      'Total Pagado': debt.totalPaid,
      'Restante': debt.remaining,
      'Pago Minimo': debt.minPayment,
      'Fecha de Pago': debt.paymentDate.toLocaleDateString('en-US'),
      'Pagado?': debt.isPaid ? '✅' : '❌',
      'Notas': debt.notes || ''
    }));
    
    res.json(formattedDebts);
  } catch (error) {
    console.error('Error in getDebts:', error);
    if (error.message.includes('token')) {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to fetch debts' });
  }
};

// Create a new debt
const createDebt = async (req, res, next) => {
  try {
    const userId = getUserFromToken(req);
    const { name, amount, minPayment, date, notes } = req.body;
    
    if (!name || !amount || !minPayment || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const totalAmount = Number(amount);
    const minPaymentAmount = Number(minPayment);
    
    const debt = await Debt.create({
      name,
      total: totalAmount,
      totalPaid: 0,
      remaining: totalAmount, // Calculate remaining on creation
      minPayment: minPaymentAmount,
      paymentDate: new Date(date),
      notes,
      user: userId
    });
    
    res.status(201).json({
      message: 'Debt created successfully',
      debt
    });
  } catch (error) {
    console.error('Error in createDebt:', error);
    if (error.message.includes('token')) {
      return res.status(401).json({ error: error.message });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create debt' });
  }
};

// Update a debt
const updateDebt = async (req, res, next) => {
  try {
    const userId = getUserFromToken(req);
    const { id } = req.params;
    
    const debt = await Debt.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!debt) {
      return res.status(404).json({ error: 'Debt not found' });
    }
    
    res.json({
      message: 'Debt updated successfully',
      debt
    });
  } catch (error) {
    console.error('Error in updateDebt:', error);
    if (error.message.includes('token')) {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update debt' });
  }
};

// Delete a debt
const deleteDebt = async (req, res, next) => {
  try {
    const userId = getUserFromToken(req);
    const { id } = req.params;
    
    const debt = await Debt.findOneAndDelete({ _id: id, user: userId });
    
    if (!debt) {
      return res.status(404).json({ error: 'Debt not found' });
    }
    
    res.json({
      message: 'Debt deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteDebt:', error);
    if (error.message.includes('token')) {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to delete debt' });
  }
};

module.exports = {
  getDebts,
  createDebt,
  updateDebt,
  deleteDebt
};
