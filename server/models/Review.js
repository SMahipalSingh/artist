import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    artwork_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Artwork',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;
