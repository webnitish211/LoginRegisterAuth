
import jwt from 'jsonwebtoken';
import User from '../models/Users.js';

// 🔐 Authentication Middleware
// Protects routes by verifying JWT token
// Adds user info to request object if token is valid

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for "Authorization: Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    try {
      // Verify token using secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

      // Find user from database using ID in token
      const user = await User.findById(decoded.id).select('-password');

      if (user) {
        req.user = user; // attach user to request
      } else {
        req.user = null;
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next(); // Continue to the next middleware/controller
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ESM export above