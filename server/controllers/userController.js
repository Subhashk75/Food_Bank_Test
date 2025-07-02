
const { User } = require('../models/User');
const { signToken } = require('../utils/auth');
const sendMail = require('../schemas/emailConfig');

const getOtpUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists. Please login.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendMail(email, otp);

    const user = new User({ email, Otp: otp });
    await user.save();

    return res.status(200).json({ success: true, message: 'OTP sent to email.' });
  } catch (error) {
    return next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, verificationCode } = req.body;

    if (!email || !username || !password || !verificationCode) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const user = await User.findOne({ email, Otp: verificationCode });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    user.username = username;
    user.password = password;
    user.isVerified = true;
    user.Otp = null;

    await user.save();

    const token = signToken(user);

    return res.status(201).json({
      success: true,
      token,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.isCorrectPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your account first.' });
    }

    const token = signToken(user);

    return res.status(200).json({
      success: true,
      token,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getOtpUser,
};
