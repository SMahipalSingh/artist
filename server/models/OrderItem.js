import mongoose from 'mongoose';

const orderItemSchema = mongoose.Schema(
  {
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
    artwork_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Artwork',
    },
    artist_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  }
);

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

export default OrderItem;
