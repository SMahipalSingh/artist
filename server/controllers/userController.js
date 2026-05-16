import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';

import User from '../models/User.js';
import Membership from '../models/Membership.js';


// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  const populatedUsers = await Promise.all(
    users.map(async (u) => {
      const MembershipModel = mongoose.model('Membership');
      const membership = await MembershipModel.findOne({ user_id: u._id, isActive: true });
      return {
        ...u.toObject(),
        subscriptionPlan: membership ? membership.plan : 'basic',
      };
    })
  );
  res.json(populatedUsers);
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

import crypto from 'crypto';

export const upgradeUserSubscription = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { plan, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
    const upgradePlan = plan || 'pro';
    
    // Verify Razorpay signature
    if (razorpayPaymentId && razorpayOrderId && razorpaySignature) {
      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'SJpGiVpxTI2jgmlUJhCEajGm')
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        res.status(400);
        throw new Error('Invalid payment signature');
      }
    } else {
      res.status(400);
      throw new Error('Payment details missing');
    }

    const MembershipModel = mongoose.model('Membership');
    let membership = await MembershipModel.findOne({ user_id: user._id });
    if (membership) {
      membership.plan = upgradePlan;
      membership.isActive = true;
      membership.startDate = Date.now();
      await membership.save();
    } else {
      membership = await MembershipModel.create({
        user_id: user._id,
        plan: upgradePlan,
        startDate: Date.now(),
        isActive: true
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      subscriptionPlan: membership.plan,
      token: req.headers.authorization.split(' ')[1], // echo token back
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
