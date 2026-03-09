import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Artwork from '../models/Artwork.js';

// @desc    Create new physical order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    // For a multi-vendor marketplace, we need to know who owns the art being sold.
    // Fetch the artwork details directly from DB to prevent tampering.
    const enrichedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        const art = await Artwork.findById(item.artwork).populate('artist', 'subscriptionPlan');
        return {
          ...item,
          artist: art.artist._id,
          _artistPlan: art.artist.subscriptionPlan // Temporarily hold for fee calculation below
        };
      })
    );

    // Calculate revenue splits (10% to platform, 90% to Artist)
    // Audio request: If the artist has the 6999/mo 'studio' plan, they get 0% commission (100% payout)
    const isArtistStudio = enrichedOrderItems[0]?._artistPlan === 'studio';
    
    const platformFee = Number((isArtistStudio ? 0 : 0.10 * itemsPrice).toFixed(2));
    const artistPayout = Number((isArtistStudio ? itemsPrice : 0.90 * itemsPrice).toFixed(2));

    // Clean up temporary property
    enrichedOrderItems.forEach(item => delete item._artistPlan);

    // Treat as paid immediately for mock Razorpay demo
    const order = new Order({
      orderItems: enrichedOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      platformFee,
      artistPayout,
      isPaid: true,
      paidAt: Date.now(),
      paymentResult: {
        id: `mock_razorpay_${Math.random().toString(36).substring(7)}`,
        status: 'completed',
        update_time: new Date().toISOString(),
        email_address: req.user.email,
      }
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order && (req.user.role === 'admin' || order.user._id.equals(req.user._id))) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Get all orders sold by the logged in artist
// @route   GET /api/orders/my-sales
// @access  Private/Artist
export const getMyArtistSales = asyncHandler(async (req, res) => {
  const orders = await Order.find({ 'orderItems.artist': req.user._id });
  res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Artist
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Only the artist who owns the item (or an admin) should normally update this,
    // but for simplicity in this MVP we check if it exists.
    order.orderStatus = req.body.status || order.orderStatus;
    
    // If setting to Delivered, automatically check isDelivered
    if (order.orderStatus === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});
