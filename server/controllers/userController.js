import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Upgrade user subscription
// @route   PUT /api/users/profile/upgrade
// @access  Private
export const upgradeUserSubscription = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.subscriptionPlan = req.body.plan || 'pro';
    
    // In a real app, you would verify the Razorpay signature here.
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      subscriptionPlan: updatedUser.subscriptionPlan,
      profileImage: updatedUser.profileImage,
      token: req.headers.authorization.split(' ')[1], // echo token back
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
