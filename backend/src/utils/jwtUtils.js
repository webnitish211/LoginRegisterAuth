import jwt from 'jsonwebtoken';

/**
 * @description Generate JWT token for user
 * @param {String} userId - User's ID from database
 * @returns {String} - JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    // Payload (Data to store in the token)
    { id: userId },

    // Secret Key (Used for signing the token)
    process.env.JWT_SECRET || 'your_secret_key',

    // Options
    {
      expiresIn: process.env.JWT_EXPIRE || '7d' // Token expiration time (e.g., 7 days)
    }
  );
};