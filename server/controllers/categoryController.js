const mongoose = require('mongoose');
const { Category} = require('../models/Category');

const defaultCategories = [
  { _id: new mongoose.Types.ObjectId(), name: 'Fruits' },
  { _id: new mongoose.Types.ObjectId(), name: 'Vegetables' },
  { _id: new mongoose.Types.ObjectId(), name: 'Dairy' },
  { _id: new mongoose.Types.ObjectId(), name: 'Meat' },
  { _id: new mongoose.Types.ObjectId(), name: 'Grains' },
  { _id: new mongoose.Types.ObjectId(), name: 'Beverages' },
];

const getAllCategories = async (req, res, next) => {
  try {
    let categories = await Category.find();

    if (categories.length === 0) {
      categories = await Category.insertMany(defaultCategories);
    }

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ 
        success: false,
        message: 'Category name is required' 
      });
    }

    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: 'Category already exists'
      });
    }

    const category = await Category.create({ name });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  createCategory
};