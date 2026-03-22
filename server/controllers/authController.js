import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Membership from '../models/Membership.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const membership = await Membership.findOne({ user_id: user._id, isActive: true });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      subscriptionPlan: membership ? membership.plan : 'basic',
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Let role only be collector or artist from frontend
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const userRole = role === 'artist' ? 'artist' : 'collector';

  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
  });

  if (user) {
    // Create default basic membership
    await Membership.create({
      user_id: user._id,
      plan: 'basic',
      isActive: true,
      startDate: Date.now(),
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      subscriptionPlan: 'basic',
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile (Current logged in user)
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const membership = await Membership.findOne({ user_id: user._id, isActive: true });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      subscriptionPlan: membership ? membership.plan : 'basic',
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
