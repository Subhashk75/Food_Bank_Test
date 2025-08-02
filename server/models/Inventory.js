const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit: {
    type: String,
    enum: ['pcs', 'kg', 'g', 'l', 'ml', 'box', 'pack'],
    default: 'pcs'
  },
  purpose: {
    type: String,
    required: true
  },
  batchSize: String,
  receivedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports={Inventory};
