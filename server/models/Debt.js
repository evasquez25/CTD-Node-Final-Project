const mongoose = require('mongoose');

const DebtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a debt name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  total: {
    type: Number,
    required: [true, 'Please provide a total amount'],
    min: [0, 'Total must be a positive number']
  },
  totalPaid: {
    type: Number,
    default: 0,
    min: [0, 'Total paid cannot be negative']
  },
  remaining: {
    type: Number,
    required: [true, 'Please provide a remaining amount'],
    min: [0, 'Remaining cannot be negative']
  },
  minPayment: {
    type: Number,
    required: [true, 'Please provide a minimum payment'],
    min: [0, 'Minimum payment must be a positive number']
  },
  paymentDate: {
    type: Date,
    required: [true, 'Please provide a payment date']
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Debt must belong to a user']
  }
}, {
  timestamps: true
});

// Calculate remaining amount and paid status before saving
DebtSchema.pre('save', function() {
  if (this.isModified('totalPaid') || this.isModified('total')) {
    this.remaining = this.total - this.totalPaid;
    this.isPaid = this.remaining <= 0;
  }
});

module.exports = mongoose.model('Debt', DebtSchema);
