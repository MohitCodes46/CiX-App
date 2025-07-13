const nodemailer = require('nodemailer');

// For mock mode, create a dummy transporter
const isMockMode = !process.env.EMAIL_HOST || !process.env.EMAIL_USER;

const transporter = isMockMode ? {
  sendMail: (options) => {
    console.log('📧 [MOCK EMAIL] Would send:', options);
    return Promise.resolve({ messageId: 'mock-email-id' });
  },
  verify: (callback) => callback(null, true)
} : nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log(isMockMode ? '📧 Mock email server ready' : '✅ Email server is ready to send messages');
  }
});

module.exports = transporter;
