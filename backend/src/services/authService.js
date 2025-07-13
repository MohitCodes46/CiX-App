const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { supabase, supabasePublic } = require('../config/supabase');
const transporter = require('../config/email');

class AuthService {
  // Generate JWT token
  static generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
  }

  // Register new user
  static async register(userData) {
    try {
      const { email, password, firstName, lastName } = userData;

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create user in Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // Create user profile in database
      const { data: user, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authUser.user.id,
          email,
          first_name: firstName,
          last_name: lastName
        })
        .select()
        .single();

      if (profileError) {
        throw new Error(profileError.message);
      }

      // Generate token
      const token = this.generateToken(user.id);

      // Send welcome email
      await this.sendWelcomeEmail(user.email, user.first_name);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          createdAt: user.created_at
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }

  // Login user
  static async login(email, password) {
    try {
      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) {
        throw new Error('Invalid email or password');
      }

      // Get user profile
      const { data: user, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !user) {
        throw new Error('User profile not found');
      }

      // Generate token
      const token = this.generateToken(user.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          avatarUrl: user.avatar_url,
          createdAt: user.created_at
        },
        token
      };
    } catch (error) {
      throw error;
    }
  }

  // Social login
  static async socialLogin(provider, accessToken) {
    try {
      // This would integrate with social providers
      // For now, we'll simulate the process
      const { data: user, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          queryParams: {
            access_token: accessToken
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Forgot password
  static async forgotPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL}/reset-password`
      });

      if (error) {
        throw new Error(error.message);
      }

      // Send reset email
      await this.sendPasswordResetEmail(email);

      return { message: 'Password reset email sent' };
    } catch (error) {
      throw error;
    }
  }

  // Reset password
  static async resetPassword(token, newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error(error.message);
      }

      return { message: 'Password updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Send welcome email
  static async sendWelcomeEmail(email, firstName) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to CiX - Where Elegance Becomes Identity',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8B5CF6;">Welcome to CiX, ${firstName}!</h2>
            <p>Thank you for joining the CiX luxury family. We're excited to have you as part of our exclusive community.</p>
            <p>Discover our curated collection of luxury clothing, watches, and accessories that celebrate your unique style.</p>
            <div style="background-color: #8B5CF6; color: white; padding: 20px; text-align: center; margin: 20px 0;">
              <h3>Your First Order</h3>
              <p>Use code <strong>WELCOME20</strong> for 20% off your first purchase!</p>
            </div>
            <p>Best regards,<br>The CiX Team</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  // Send password reset email
  static async sendPasswordResetEmail(email) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'CiX - Password Reset Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8B5CF6;">Password Reset Request</h2>
            <p>You requested a password reset for your CiX account.</p>
            <p>Click the link below to reset your password:</p>
            <div style="background-color: #8B5CF6; color: white; padding: 20px; text-align: center; margin: 20px 0;">
              <a href="${process.env.FRONTEND_URL}/reset-password" style="color: white; text-decoration: none;">
                Reset Password
              </a>
            </div>
            <p>If you didn't request this, please ignore this email.</p>
            <p>Best regards,<br>The CiX Team</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  }

  // Verify token
  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', decoded.userId)
        .single();

      if (error || !user) {
        throw new Error('Invalid token');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
