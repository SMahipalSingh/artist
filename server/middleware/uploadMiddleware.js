import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const isProduction = process.env.NODE_ENV === 'production';

// ─── Cloudinary config (production) ─────────────────────────────────────────
if (isProduction) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// ─── Storage ─────────────────────────────────────────────────────────────────
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'artishub/artworks',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'tiff', 'svg'],
    resource_type: 'auto',
  },
});

const diskStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/artworks/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// ─── File type check (disk storage only) ─────────────────────────────────────
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|gif|webp|tiff|svg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

// ─── Multer instance ─────────────────────────────────────────────────────────
const upload = multer({
  storage: isProduction ? cloudinaryStorage : diskStorage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB
  fileFilter: isProduction
    ? undefined // Cloudinary handles format validation
    : (req, file, cb) => checkFileType(file, cb),
});

export default upload;
