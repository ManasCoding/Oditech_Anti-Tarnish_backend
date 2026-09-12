import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('Testing upload to new account ...');

try {
  const result = await cloudinary.uploader.upload(
    'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    {
      folder: 'Home/anti-tarnish'
    }
  );
  console.log('✅ SUCCESS! Uploaded to:', result.secure_url);
} catch (error) {
  console.error('❌ FAILED:', error.message, 'HTTP:', error.http_code);
}

