const jwt = require('jsonwebtoken');

// Middleware to verify JWT and role
exports.authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      next();
    } catch (err) {
      res.status(400).json({ error: 'Invalid token' });
    }
  };
};
