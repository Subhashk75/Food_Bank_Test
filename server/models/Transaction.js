const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    required: true,
    min: 1
  },
  purpose: {
    type: String,
    required: true
  },
  batchSize: {
    type: String,
    required: false // Made optional for single transactions
  },
 // In your Transaction model
   operation: {
      type: String,
      enum: ['Receive', 'Distribute'],
      default: 'Distribute' // Add default value
    },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = { Transaction };