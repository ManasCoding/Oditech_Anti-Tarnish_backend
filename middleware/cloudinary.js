import { v2 as cloudinary } from 'cloudinary';
import os from 'os';
import multer from 'multer';
import dotenv from 'dotenv';
import { unlink } from 'fs/promises';
import { join, extname } from 'path';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disk storage — saves file locally before Cloudinary upload
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    const ext = extname(file.originalname) || '.jpg';
    cb(null, `upload_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Upload a local file to Cloudinary and delete it afterwards
export const uploadToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
    });
    return result;
  } finally {
    await unlink(filePath).catch(() => {});
  }
};

// Multer instance for profile photos and product images
export const upload = multer({ storage: diskStorage, fileFilter });
export const productUpload = multer({ storage: diskStorage, fileFilter });
export default cloudinary;
