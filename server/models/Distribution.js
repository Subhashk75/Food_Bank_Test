const mongoose = require('mongoose');

const distributionSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  unit: { type: Number, required: true },
  operation: { type: String, enum: ['Distribute'], required: true },
  purpose: { type: String, required: true },
  batch: { type: String, required: true },
  distributedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Distribution', distributionSchema);
