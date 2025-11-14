const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./config/connection');

const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const transactionRoute = require("./routes/transaction");
const inventoryRoute = require("./routes/inventory");
const categoriesRoute = require("./routes/category");

const app = express();

// Render injects PORT (do NOT hardcode)
const PORT = process.env.PORT || 8080;

// Correct CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://food-bank-test-1.onrender.com'  // ✅ your frontend URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

// To parse JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API Routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/product', productRoute);
app.use('/api/v1/transaction', transactionRoute);
app.use('/api/v1/inventory', inventoryRoute);
app.use('/api/v1/categories', categoriesRoute);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// MongoDB + Start Server
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
});
