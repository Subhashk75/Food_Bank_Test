const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getOtpUser
} = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/getOtp', getOtpUser);


module.exports = router;