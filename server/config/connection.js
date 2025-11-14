require('dotenv').config(); // Load environment variables from .env file

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { // Use environment variable for the connection string
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.once('open', () => console.log('✅ MongoDB connected successfully'));

db.on('error', (err) => console.error('❌ MongoDB connection error:', err));

db.on('disconnected', () => console.log('⚠️ MongoDB disconnected'));

module.exports = db;
