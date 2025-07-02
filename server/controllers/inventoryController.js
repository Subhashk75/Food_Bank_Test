// =========================
// Backend: inventoryController.js
// =========================

const mongoose = require('mongoose');
const Inventory = require('../models/Inventory');
const { Product } = require('../models/Product');
const { Transaction } = require('../models/Transaction');

// @desc    Get all inventory records
// @route   GET /api/v1/inventory
const getInventory = async (req, res) => {
  try {
    const records = await Inventory.find().populate('productId').populate('receivedBy').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch inventory', error: error.message });
  }
};


// @desc    Create a single inventory record
// @route   POST /api/v1/inventory
// @access  Protected (expects req.user.id)
const createInventoryItem = async (req, res) => {
  try {
    const {
      productId,
      quantity,
      unit,
      purpose,
      batch
    } = req.body;

    const userId = req.user?.id;

    if (!productId || !quantity || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'productId, quantity, and purpose are required.'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update product stock
    product.quantity += Number(quantity);
    await product.save();

    // Create inventory record
    const newInventory = new Inventory({
      productId: product._id,
      name: product.name,
      quantity,
      unit: unit || 'pcs',
      purpose,
      batch,
      receivedBy: userId
    });

    await newInventory.save();

    res.status(201).json({
      success: true,
      data: newInventory
    });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create inventory item',
      error: error.message
    });
  }
};  


// @desc    Receive inventory items
// @route   POST /api/v1/inventory/receive
const receiveInventory = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { products, unit, purpose, batch } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'Products array is required' });
    }

    if (!purpose) {
      return res.status(400).json({ success: false, message: 'Purpose is required' });
    }

    const processedProducts = [];
    const inventoryRecords = [];

    for (const product of products) {
      if (!product._id || !product.quantity) {
        throw new Error(`Invalid product data: ${JSON.stringify(product)}`);
      }

      const dbProduct = await Product.findById(product._id).session(session);
      if (!dbProduct) {
        throw new Error(`Product not found: ${product._id}`);
      }

      const quantityToAdd = unit ? product.quantity * parseInt(unit) : product.quantity;

      dbProduct.quantity += quantityToAdd;
      await dbProduct.save({ session });

      const inventoryRecord = new Inventory({
        productId: dbProduct._id,
        name: dbProduct.name,
        quantity: quantityToAdd,
        unit: product.unit || 'pcs',
        purpose,
        batch,
        receivedBy: userId
      });

      await inventoryRecord.save({ session });
      inventoryRecords.push(inventoryRecord);

      processedProducts.push({
        productId: dbProduct._id,
        name: dbProduct.name,
        quantityAdded: quantityToAdd,
        unit: product.unit || 'pcs',
        newQuantity: dbProduct.quantity
      });
    }

    const transaction = await Transaction.create([{
      type: 'receipt',
      products: processedProducts,
      purpose,
      batch,
      unit: unit || 'pcs',
      createdBy: userId
    }], { session });

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      data: {
        transaction: transaction[0],
        inventory: inventoryRecords,
        products: processedProducts
      }
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: 'Failed to receive inventory',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

module.exports = {
  getInventory,
  receiveInventory,
  createInventoryItem
};
