import crypto from 'crypto';
import User from '../models/Users.js';
import { generateToken } from '../utils/jwtUtils.js';
import { sendResetPasswordEmail } from '../utils/sendEmail.js';

// Register a new user
// POST /api/auth/register
// Public access

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

/**
 * Login existing user
 * POST /api/auth/login
 * Public access
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error during login',
      error: error.message,
    });
  }
};


// @desc    Send password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Please provide email' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Security: Don't reveal if user exists
    if (!user) {
      return res.json({
        message: 'If an account exists with this email, a password reset link has been sent',
      });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set reset token and expiry on user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires =
      Date.now() + parseInt(process.env.RESET_TOKEN_EXPIRE || '3600000'); // default 1 hour

    await user.save();

    // Send password reset email
    const emailResult = await sendResetPasswordEmail(user.email, resetToken);

    if (emailResult.error && emailResult.error.includes('email configuration is missing')) {
      return res.status(500).json({
        message: 'Email service is not configured. Please contact administrator.',
        error: 'EMAIL_CONFIG_MISSING',
      });
    }

    if (!emailResult.success) {
      return res.status(500).json({
        message: 'Error sending email. Please try again later.',
        error: emailResult.error || 'EMAIL_SEND_FAILED',
      });
    }

    res.json({
      message: 'If an account exists with this email, a password reset link has been sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      message: 'Server error. Please try again later.',
      error: error.message,
    });
  }
};



// @desc    Reset password using token from email
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Please provide token and new password' });
    }

    // Hash the token to match with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with matching token and valid expiration
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // Optionally generate a new JWT for auto-login after reset
    const jwtToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Password reset successfully',
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};


// controllers/authController.js

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private (requires authentication)
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND',
      });
    }

    res.json({
      success: true,
      user: {
        id: req.user._id || req.user.id,
        name: req.user.name || '',
        email: req.user.email || '',
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

// (ESM named exports above)
