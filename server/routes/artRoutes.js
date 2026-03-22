import express from 'express';
const router = express.Router();
import {
  getArtworks,
  getArtworkById,
  uploadArtwork,
  downloadArtworkPdf,
  createArtworkReview,
  getArtworkReviews,
} from '../controllers/artController.js';
import { protect, artist } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

router.route('/').get(getArtworks).post(
  protect,
  artist,
  upload.single('image'),
  uploadArtwork
);
router.route('/:id').get(getArtworkById);
router.route('/:id/reviews').get(getArtworkReviews).post(protect, createArtworkReview);
router.route('/:id/download').get(protect, downloadArtworkPdf);

export default router;
