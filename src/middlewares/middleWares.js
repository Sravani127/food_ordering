const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authorizationHeader.slice(7); // Remove 'Bearer ' prefix

  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
