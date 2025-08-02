const jwt = require('jsonwebtoken');
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  authMiddleware: function (req, res, next) {
    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    if (!token) return res.status(401).json({ message: 'No token provided.' });

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
  },

  authorizeRoles: (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied: insufficient role' });
      }
      next();
    };
  },

  signToken: function ({ username, email, _id, role }) {
    const payload = { username, email, _id, role };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  }
};
