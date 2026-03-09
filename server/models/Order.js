import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true, default: 1 },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        artwork: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Artwork',
        },
        artist: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'Razorpay',
    },
    paymentResult: {
      status: { type: String, default: 'Pending' },
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
    platformFee: {
      type: Number,
      required: true,
      default: 0.0,
    },
    artistPayout: {
      type: Number,
      required: true,
      default: 0.0,
    },
    orderStatus: {
    type: String,
    enum: ['Ordered', 'Accepted', 'Shipped', 'In Transit', 'Delivered'],
    default: 'Ordered',
  },
  isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
