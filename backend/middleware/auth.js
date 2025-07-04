const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userEmail = decoded.email; // ✅ Fix: Attach email instead of uid
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
