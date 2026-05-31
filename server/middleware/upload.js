const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dvorfxnmd',
  api_key: '165646225919294',
  api_secret: 'uNzxlC9HzAMRAiyxbdFZZfUeSt8'
});

// Use memory storage (store file in memory temporarily)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'campusbazaar' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(fileBuffer);
  });
};

module.exports = { upload, uploadToCloudinary };