import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Artwork from '../models/Artwork.js';
import OrderItem from '../models/OrderItem.js';
import Membership from '../models/Membership.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Setup Razorpay instance
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};
// @desc    Create new physical order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress, // Ignored in DB but from frontend
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
  } = req.body;

  // Verify Razorpay signature if payment method is Razorpay
  if (paymentMethod === 'Razorpay') {
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      res.status(400);
      throw new Error('Invalid payment signature');
    }
  }

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const enrichedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        const art = await Artwork.findById(item.artwork);
        const membership = await Membership.findOne({ user_id: art.artist_id, isActive: true });
        return {
          ...item,
          artist_id: art.artist_id,
          _artistPlan: membership ? membership.plan : 'basic'
        };
      })
    );

    const isArtistStudio = enrichedOrderItems[0]?._artistPlan === 'studio';
    const platformFee = Number((isArtistStudio ? 0 : 0.10 * itemsPrice).toFixed(2));
    const artistPayout = Number((isArtistStudio ? itemsPrice : 0.90 * itemsPrice).toFixed(2));

    enrichedOrderItems.forEach(item => delete item._artistPlan);

    const order = new Order({
      user_id: req.user._id,
      paymentMethod,
      paymentStatus: 'Completed',
      orderType: 'Physical',
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      platformFee,
      artistPayout,
      shippingAddress: shippingAddress || {},
      isPaid: true,
      paidAt: Date.now(),
    });

    const createdOrder = await order.save();

    const orderItemsToCreate = enrichedOrderItems.map(item => ({
       order_id: createdOrder._id,
       artwork_id: item.artwork,
       artist_id: item.artist_id,
       name: item.name,
       price: item.price,
       quantity: item.qty || 1
    }));
    
    await OrderItem.insertMany(orderItemsToCreate);

    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user_id: req.user._id });
  const populatedOrders = await Promise.all(orders.map(async (order) => {
    const items = await OrderItem.find({ order_id: order._id });
    return { ...order.toObject(), orderItems: items };
  }));
  res.json(populatedOrders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user_id',
    'name email'
  );

  if (order && (req.user.role === 'admin' || order.user_id.equals(req.user._id))) {
    const items = await OrderItem.find({ order_id: order._id });
    res.json({ ...order.toObject(), orderItems: items });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user_id', 'id name');
  // Attach orderItems so admin dashboard can access platformFee etc.
  const populatedOrders = await Promise.all(orders.map(async (order) => {
    const orderItems = await OrderItem.find({ order_id: order._id });
    return { ...order.toObject(), orderItems };
  }));
  res.json(populatedOrders);
});

// @desc    Get all orders sold by the logged in artist
// @route   GET /api/orders/my-sales
// @access  Private/Artist
export const getMyArtistSales = asyncHandler(async (req, res) => {
  const items = await OrderItem.find({ artist_id: req.user._id });
  const orderIds = [...new Set(items.map(i => i.order_id.toString()))];
  const orders = await Order.find({ _id: { $in: orderIds } });
  // Attach orderItems to each order so the frontend can display item names
  const populatedOrders = await Promise.all(orders.map(async (order) => {
    const orderItems = await OrderItem.find({ order_id: order._id });
    return { ...order.toObject(), orderItems };
  }));
  res.json(populatedOrders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Artist
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.orderStatus = req.body.status || order.orderStatus;
    const updatedOrder = await order.save();
    
    // Attach orderItems to prevent frontend crashes on state update
    const orderItems = await OrderItem.find({ order_id: updatedOrder._id });
    
    res.json({ ...updatedOrder.toObject(), orderItems });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Create Razorpay Order
// @route   POST /api/orders/razorpay/create
// @access  Private
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body; // Amount should be in rupees

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Invalid amount');
  }

  const instance = getRazorpayInstance();

  const options = {
    amount: Math.round(amount * 100), // Convert to paise
    currency: 'INR',
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await instance.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500);
    throw new Error('Failed to create Razorpay order');
  }
});
