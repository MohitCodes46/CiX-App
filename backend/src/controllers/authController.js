const AuthService = require('../services/authService');

// Register new user
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const result = await AuthService.register({
      email,
      password,
      firstName,
      lastName
    });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: error.message
    });
  }
};

// Social login
const socialLogin = async (req, res) => {
  try {
    const { provider, accessToken } = req.body;

    const result = await AuthService.socialLogin(provider, accessToken);

    res.status(200).json({
      status: 'success',
      message: 'Social login successful',
      data: result
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: error.message
    });
  }
};

// Forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    await AuthService.forgotPassword(email);

    res.status(200).json({
      status: 'success',
      message: 'Password reset email sent'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    await AuthService.resetPassword(token, newPassword);

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    // In a JWT-based system, logout is typically handled client-side
    // by removing the token. However, you could implement a blacklist here.
    
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

module.exports = {
  register,
  login,
  socialLogin,
  forgotPassword,
  resetPassword,
  getCurrentUser,
  logout
};
