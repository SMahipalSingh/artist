import mongoose from 'mongoose';

const artworkSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    artist_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    // The regular image for display (e.g. low-res thumbnail)
    imageUrl: {
      type: String,
      required: true,
    },
    // The original high-resolution file to be downloaded by collectors
    sourceFileUrl: {
      type: String,
      required: false,
    },
    resolution: {
      type: String,
    },
    fileType: {
      type: String,
    },
  }
);

const Artwork = mongoose.model('Artwork', artworkSchema);

export default Artwork;
