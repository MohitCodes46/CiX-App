const { supabase } = require('../config/supabase');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error('User not found');
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated
    delete updateData.id;
    delete updateData.email;
    delete updateData.created_at;
    delete updateData.updated_at;

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update user avatar
const updateUserAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    // Upload to Supabase Storage
    const filename = `avatar-${userId}-${Date.now()}.jpg`;
    const { data, error } = await supabase.storage
      .from('user-avatars')
      .upload(filename, req.file.buffer, {
        contentType: 'image/jpeg'
      });

    if (error) {
      throw new Error('Failed to upload image');
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-avatars')
      .getPublicUrl(filename);

    // Update user profile
    const { data: user, error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    res.status(200).json({
      status: 'success',
      message: 'Avatar updated successfully',
      data: { user }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get user addresses
const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({
      status: 'success',
      data: { addresses: addresses || [] }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Add user address
const addUserAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressData = req.body;

    const { data: address, error } = await supabase
      .from('addresses')
      .insert({
        ...addressData,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.status(201).json({
      status: 'success',
      message: 'Address added successfully',
      data: { address }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update user address
const updateUserAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const { data: address, error } = await supabase
      .from('addresses')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({
      status: 'success',
      message: 'Address updated successfully',
      data: { address }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete user address
const deleteUserAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({
      status: 'success',
      message: 'Address deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get user payment methods
const getUserPaymentMethods = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: paymentMethods, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({
      status: 'success',
      data: { paymentMethods: paymentMethods || [] }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Add user payment method
const addUserPaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id;
    const paymentData = req.body;

    const { data: paymentMethod, error } = await supabase
      .from('payment_methods')
      .insert({
        ...paymentData,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    res.status(201).json({
      status: 'success',
      message: 'Payment method added successfully',
      data: { paymentMethod }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Delete user payment method
const deleteUserPaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({
      status: 'success',
      message: 'Payment method deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getUserPaymentMethods,
  addUserPaymentMethod,
  deleteUserPaymentMethod
};
