import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import Product from './models/Product.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing products and categories');

    // Create Categories
    const categoriesData = [
      { name: 'Necklaces', slug: 'necklaces', description: 'Beautiful necklaces' },
      { name: 'Earrings', slug: 'earrings', description: 'Stunning earrings' },
      { name: 'Rings', slug: 'rings', description: 'Elegant rings' },
      { name: 'Bracelets', slug: 'bracelets', description: 'Charming bracelets' },
      { name: 'Anklets', slug: 'anklets', description: 'Graceful anklets' }
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log('Inserted categories');

    const catMap = {};
    categories.forEach(c => {
      catMap[c.name] = c._id;
    });

    // Create 20 Demo Products
    const productsData = [
      {
        name: 'Classic Gold Chain Necklace',
        slug: 'classic-gold-chain-necklace',
        description: 'A timeless 18k gold plated classic chain.',
        price: 1299, originalPrice: 1599, stock: 45, category: catMap['Necklaces'],
        images: ['https://images.unsplash.com/photo-1599643478524-fb66f7ca0f8f?w=600&h=600&fit=crop'],
        featured: true, bestSeller: true, material: 'Stainless Steel'
      },
      {
        name: 'Pearl Drop Earrings',
        slug: 'pearl-drop-earrings',
        description: 'Elegant freshwater pearl drops.',
        price: 899, originalPrice: 1199, stock: 30, category: catMap['Earrings'],
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop'],
        newArrival: true, material: 'Brass'
      },
      {
        name: 'Twisted Band Ring',
        slug: 'twisted-band-ring',
        description: 'A beautiful twisted design ring.',
        price: 699, stock: 15, category: catMap['Rings'],
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b2548e?w=600&h=600&fit=crop'],
        material: 'Stainless Steel'
      },
      {
        name: 'Cubic Zirconia Tennis Bracelet',
        slug: 'cz-tennis-bracelet',
        description: 'Sparkling CZ tennis bracelet.',
        price: 1599, originalPrice: 2000, stock: 50, category: catMap['Bracelets'],
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop'],
        featured: true, bestSeller: true, material: 'Copper'
      },
      {
        name: 'Heart Charm Anklet',
        slug: 'heart-charm-anklet',
        description: 'Delicate anklet with heart charm.',
        price: 499, stock: 20, category: catMap['Anklets'],
        images: ['https://images.unsplash.com/photo-1620655385552-3375c88c7f20?w=600&h=600&fit=crop'],
        material: 'Stainless Steel'
      },
      {
        name: 'Layered Coin Necklace',
        slug: 'layered-coin-necklace',
        description: 'Trendy multi-layered coin necklace.',
        price: 1499, originalPrice: 1899, stock: 25, category: catMap['Necklaces'],
        images: ['https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&h=600&fit=crop'],
        bestSeller: true, material: 'Brass'
      },
      {
        name: 'Chunky Hoop Earrings',
        slug: 'chunky-hoop-earrings',
        description: 'Bold and lightweight chunky hoops.',
        price: 799, stock: 40, category: catMap['Earrings'],
        images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=600&fit=crop'],
        bestSeller: true, material: 'Stainless Steel'
      },
      {
        name: 'Solitaire Promise Ring',
        slug: 'solitaire-promise-ring',
        description: 'Stunning single stone promise ring.',
        price: 1199, originalPrice: 1499, stock: 12, category: catMap['Rings'],
        images: ['https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=600&h=600&fit=crop'],
        featured: true, material: 'Sterling Silver'
      },
      {
        name: 'Snake Chain Bracelet',
        slug: 'snake-chain-bracelet',
        description: 'Sleek and smooth snake chain.',
        price: 899, stock: 35, category: catMap['Bracelets'],
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop'],
        newArrival: true, material: 'Stainless Steel'
      },
      {
        name: 'Beaded Summer Anklet',
        slug: 'beaded-summer-anklet',
        description: 'Colorful beads for perfect summer vibes.',
        price: 399, stock: 60, category: catMap['Anklets'],
        images: ['https://images.unsplash.com/photo-1620655385552-3375c88c7f20?w=600&h=600&fit=crop'],
        material: 'Alloy'
      },
      {
        name: 'Initial Letter Pendant',
        slug: 'initial-letter-pendant',
        description: 'Personalized initial letter pendant necklace.',
        price: 999, originalPrice: 1299, stock: 100, category: catMap['Necklaces'],
        images: ['https://images.unsplash.com/photo-1599643478524-fb66f7ca0f8f?w=600&h=600&fit=crop'],
        bestSeller: true, material: 'Stainless Steel'
      },
      {
        name: 'Geometric Dangle Earrings',
        slug: 'geometric-dangle-earrings',
        description: 'Modern geometric design earrings.',
        price: 850, stock: 22, category: catMap['Earrings'],
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop'],
        material: 'Brass'
      },
      {
        name: 'Vintage Emerald Ring',
        slug: 'vintage-emerald-ring',
        description: 'Vintage style ring with synthetic emerald.',
        price: 1899, originalPrice: 2499, stock: 8, category: catMap['Rings'],
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b2548e?w=600&h=600&fit=crop'],
        featured: true, material: 'Silver Plated'
      },
      {
        name: 'Bangle Cuff Bracelet',
        slug: 'bangle-cuff-bracelet',
        description: 'Minimalist open cuff bangle.',
        price: 1099, stock: 18, category: catMap['Bracelets'],
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop'],
        material: 'Stainless Steel'
      },
      {
        name: 'Starfish Anklet',
        slug: 'starfish-anklet',
        description: 'Beach ready starfish charm anklet.',
        price: 550, stock: 28, category: catMap['Anklets'],
        images: ['https://images.unsplash.com/photo-1620655385552-3375c88c7f20?w=600&h=600&fit=crop'],
        newArrival: true, material: 'Stainless Steel'
      },
      {
        name: 'Lariat Y-Necklace',
        slug: 'lariat-y-necklace',
        description: 'Elegant Y-shaped lariat necklace.',
        price: 1150, stock: 33, category: catMap['Necklaces'],
        images: ['https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&h=600&fit=crop'],
        material: 'Brass'
      },
      {
        name: 'Diamond Stud Earrings',
        slug: 'diamond-stud-earrings',
        description: 'Classic tiny diamond simulant studs.',
        price: 1399, originalPrice: 1999, stock: 55, category: catMap['Earrings'],
        images: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=600&fit=crop'],
        bestSeller: true, featured: true, material: 'Sterling Silver'
      },
      {
        name: 'Stackable Ring Set',
        slug: 'stackable-ring-set',
        description: 'Set of 3 minimal stackable rings.',
        price: 1299, stock: 40, category: catMap['Rings'],
        images: ['https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=600&h=600&fit=crop'],
        material: 'Stainless Steel'
      },
      {
        name: 'Charm Bracelet',
        slug: 'charm-bracelet',
        description: 'Customizable bracelet with various charms.',
        price: 1699, stock: 14, category: catMap['Bracelets'],
        images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop'],
        material: 'Copper'
      },
      {
        name: 'Moon & Star Anklet',
        slug: 'moon-star-anklet',
        description: 'Celestial themed anklet.',
        price: 699, stock: 25, category: catMap['Anklets'],
        images: ['https://images.unsplash.com/photo-1620655385552-3375c88c7f20?w=600&h=600&fit=crop'],
        bestSeller: true, material: 'Stainless Steel'
      }
    ];

    await Product.insertMany(productsData);
    console.log('Inserted 20 demo products');

    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
