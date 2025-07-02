const Distribution = require('../models/Distribution');
const {Product} = require('../models/Product');

// Create distribution records
const createDistributions = async (req, res) => {
  try {
    const distributions = req.body;

    if (!Array.isArray(distributions) || distributions.length === 0) {
      return res.status(400).json({ message: 'Distribution data must be a non-empty array.' });
    }

    const distributionDocs = [];

    for (const item of distributions) {
      const { product, quantity, unit, operation, purpose, batch } = item;

      if (!product || isNaN(quantity) || isNaN(unit) || !operation || !purpose || !batch) {
        return res.status(400).json({ message: 'Invalid distribution object.' });
      }

      const productExists = await Product.findById(product);
      if (!productExists) {
        return res.status(404).json({ message: `Product not found: ${product}` });
      }

      distributionDocs.push({
        product,
        quantity,
        unit,
        operation,
        purpose,
        batch,
      });
    }

    await Distribution.insertMany(distributionDocs);

    res.status(201).json({ message: 'Distributions recorded successfully.' });
  } catch (error) {
    console.error('Error in createDistributions:', error);
    res.status(500).json({ message: 'Server error while recording distributions.' });
  }
};

module.exports = {
  createDistributions,
};
