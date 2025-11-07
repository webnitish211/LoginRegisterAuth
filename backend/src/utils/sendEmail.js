import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
    secure: false, // use true for port 465, false for others
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    // --- Check for missing credentials ---
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      const isDevelopment = process.env.NODE_ENV === 'development';

      if (isDevelopment) {
        // --- Development Mode (Simulate Email) ---
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        console.log('\n=============================================');
        console.log('         PASSWORD RESET TOKEN (Development Mode)');
        console.log('=============================================');
        console.log('Email:', email);
        console.log('Reset URL:', resetUrl);
        console.log('Reset Token:', resetToken);
        console.log('=============================================');
        console.log('Note: Email configuration not found. Using development mode.');
        console.log('To enable email sending, add EMAIL_USER and EMAIL_PASS to .env file.');
        console.log('=============================================\n');

        return { success: true, development: true };
      } else {
        // --- Production Mode (Error if not configured) ---
        const errorMsg =
          'Email configuration is missing. Please set EMAIL_USER and EMAIL_PASS in .env file.';
        console.error('Error:', errorMsg);
        throw new Error(errorMsg);
      }
    }

    // --- Create transporter ---
    const transporter = createTransporter();
    if (!transporter) {
      throw new Error('Email transporter could not be created - configuration missing');
    }

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const expireHours = Math.round(
      parseInt(process.env.RESET_TOKEN_EXPIRE || '600000', 10) / 3600000
    ); // convert ms to hours

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested to reset your password. Click the link below to reset it:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: 
          white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetUrl}</p>
          <p style="color: #999; font-size: 12px;">This link will expire in ${expireHours} hour(s).</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    // --- Send the email ---
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error.message);
  return { success: false, error: error.message };
  }
};

