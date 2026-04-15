import asyncHandler from 'express-async-handler';
import Artwork from '../models/Artwork.js';
import Membership from '../models/Membership.js';
import Review from '../models/Review.js';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import https from 'https';
import http from 'http';

// @desc    Fetch all artworks
// @route   GET /api/artworks
// @access  Public
export const getArtworks = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        $or: [
          { title: { $regex: req.query.keyword, $options: 'i' } },
          { category: { $regex: req.query.keyword, $options: 'i' } }
        ]
      }
    : {};

  const artworks = await Artwork.find({ ...keyword }).populate(
    'artist_id',
    'name profileImage'
  );

  res.json(artworks);
});

// @desc    Fetch single artwork
// @route   GET /api/artworks/:id
// @access  Public
export const getArtworkById = asyncHandler(async (req, res) => {
  const artwork = await Artwork.findById(req.params.id).populate(
    'artist_id',
    'name profileImage'
  );

  if (artwork) {
    res.json(artwork);
  } else {
    res.status(404);
    throw new Error('Artwork not found');
  }
});

// @desc    Upload an artwork
// @route   POST /api/artworks
// @access  Private/Artist
export const uploadArtwork = asyncHandler(async (req, res) => {
  const { title, description, price, category, tags } = req.body;

  let imageUrl = '';
  let sourceFileUrl = '';

  if (req.file) {
    // Cloudinary (production): req.file.path is the full CDN URL
    // Disk storage (dev): build path from filename
    const filePath = req.file.path
      ? req.file.path  // Cloudinary URL
      : `/uploads/artworks/${req.file.filename}`; // local path
    imageUrl = filePath;
    sourceFileUrl = filePath;
  }

  if (!imageUrl) {
    res.status(400);
    throw new Error('Please upload a preview image');
  }

  const artwork = new Artwork({
    title,
    description,
    price: price || 0,
    category,
    tags: tags ? tags.split(',').map((tag) => tag.trim()) : [],
    imageUrl,
    sourceFileUrl,
    artist_id: req.user._id,
  });

  const createdArtwork = await artwork.save();
  res.status(201).json(createdArtwork);
});

// @desc    Download Artwork as PDF
// @route   GET /api/artworks/:id/download
// @access  Private
export const downloadArtworkPdf = asyncHandler(async (req, res) => {
  const artwork = await Artwork.findById(req.params.id);
  
  if (!artwork) {
    res.status(404);
    throw new Error('Artwork not found');
  }

  // Verify Premium Access
  const membership = await Membership.findOne({ user_id: req.user._id, isActive: true });
  const plan = membership ? membership.plan : 'basic';
  const isPremium = ['pro', 'studio'].includes(plan);
  const isPrivileged = ['admin', 'artist'].includes(req.user.role);
  
  if (!isPremium && !isPrivileged) {
    res.status(403);
    throw new Error('A CanvasFlow Pro or Studio subscription is required to download Master files.');
  }

  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${artwork.title.replace(/\s+/g, '_')}_CanvasFlow.pdf"`);

  doc.pipe(res);

  // Add Branding and License Text
  doc.fontSize(24).fillColor('#7c3aed').text('CanvasFlow Official Master License', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(14).fillColor('#333333').text(`Artwork Title: ${artwork.title}`, { align: 'center' });
  doc.fontSize(12).fillColor('#666666').text(`Licensed exclusively to: ${req.user.name} (${req.user.email})`, { align: 'center' });
  doc.moveDown(1);
  doc.fontSize(10).fillColor('#999999').text(`Transaction Date: ${new Date().toLocaleString()}`, { align: 'center' });
  doc.moveDown(2);

  // Attempt to draw image — handles both Cloudinary URLs and local paths
  try {
    const isRemoteUrl = artwork.imageUrl && artwork.imageUrl.startsWith('http');

    if (isRemoteUrl) {
      // Fetch image from Cloudinary as a Buffer
      const imageBuffer = await new Promise((resolve, reject) => {
        const protocol = artwork.imageUrl.startsWith('https') ? https : http;
        protocol.get(artwork.imageUrl, (response) => {
          const chunks = [];
          response.on('data', (chunk) => chunks.push(chunk));
          response.on('end', () => resolve(Buffer.concat(chunks)));
          response.on('error', reject);
        }).on('error', reject);
      });
      doc.image(imageBuffer, { fit: [500, 500], align: 'center', valign: 'center' });
    } else {
      // Local disk path (dev)
      const __dirname = path.resolve();
      const cleanPath = path.join(__dirname, artwork.imageUrl.replace(/^\//, ''));
      if (!fs.existsSync(cleanPath)) {
        throw new Error(`File not found at ${cleanPath}`);
      }
      doc.image(cleanPath, { fit: [500, 500], align: 'center', valign: 'center' });
    }
  } catch (err) {
    console.error('Error attaching image to PDF:', err);
    doc.fontSize(16).fillColor('red').text('- ERROR LOADING SOURCE IMAGE -', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).fillColor('black').text(err.message, { align: 'center' });
  }

  doc.end();

  // Update download stats
  await Artwork.updateOne({ _id: artwork._id }, { $inc: { downloads: 1 } });
});

// @desc    Create new review
// @route   POST /api/artworks/:id/reviews
// @access  Private
export const createArtworkReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const artworkId = req.params.id;

  const artwork = await Artwork.findById(artworkId);

  if (artwork) {
    const alreadyReviewed = await Review.findOne({
      artwork_id: artworkId,
      user_id: req.user._id,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Artwork already reviewed');
    }

    const review = await Review.create({
      user_id: req.user._id,
      artwork_id: artworkId,
      rating: Number(rating),
      comment,
    });

    res.status(201).json({ message: 'Review added', review });
  } else {
    res.status(404);
    throw new Error('Artwork not found');
  }
});

// @desc    Get artwork reviews
// @route   GET /api/artworks/:id/reviews
// @access  Public
export const getArtworkReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ artwork_id: req.params.id }).populate('user_id', 'name profileImage');
  res.json(reviews);
});
