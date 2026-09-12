import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const admins = [
  { name: 'Guman Singh', email: 'gumansingh.oditechglobal@gmail.com', password: '12345678' },
  { name: 'Oditech Official', email: 'oditechofficial@gmail.com', password: '12345678' },
];

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const admin of admins) {
      const existing = await User.findOne({ email: admin.email });
      if (!existing) {
        await User.create({ name: admin.name, email: admin.email, password: admin.password, role: 'admin' });
        console.log(`✅ Admin created: ${admin.email}`);
      } else {
        existing.role = 'admin';
        existing.password = admin.password;
        await existing.save();
        console.log(`🔄 Admin already exists, updated: ${admin.email}`);
      }
    }

    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
