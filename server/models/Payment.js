const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Please provide a payment type'],
    enum: ['Bill', 'Debt'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true,
    maxlength: [100, 'Category cannot be more than 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: [0, 'Amount must be a positive number']
  },
  paymentDate: {
    type: Date,
    required: [true, 'Please provide a payment date']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  debtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Debt',
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Payment must belong to a user']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', PaymentSchema);
