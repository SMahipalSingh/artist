import mongoose from 'mongoose';

const membershipSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    plan: {
      type: String,
      required: true,
      enum: ['basic', 'pro', 'studio'],
      default: 'basic',
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: false,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  }
);

const Membership = mongoose.model('Membership', membershipSchema);

export default Membership;
