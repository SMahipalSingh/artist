import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'Razorpay',
    },
    paymentStatus: {
      type: String,
      default: 'Pending',
    },
    orderStatus: {
      type: String,
      enum: ['Ordered', 'Accepted', 'Shipped', 'In Transit', 'Delivered'],
      default: 'Ordered',
    },
    orderType: {
      type: String,
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
