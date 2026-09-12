import mongoose from 'mongoose';
import User from './models/User.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Order from './models/Order.js';

const LOCAL_URI = 'mongodb://127.0.0.1:27017/anti-tarnish';
const ATLAS_URI = 'mongodb+srv://oditechofficial_db_user:FUrVUSQ02keknC27@cluster0.o5fo1s5.mongodb.net/Anti-Tarnish?appName=Cluster0';

async function migrate() {
  try {
    console.log('🔗 Connecting to LOCAL database...');
    const localDb = await mongoose.createConnection(LOCAL_URI).asPromise();
    
    // Bind models to local DB connection
    const LocalUser = localDb.model('User', User.schema);
    const LocalProduct = localDb.model('Product', Product.schema);
    const LocalCategory = localDb.model('Category', Category.schema);
    const LocalOrder = localDb.model('Order', Order.schema);

    console.log('🔗 Connecting to ATLAS database...');
    const atlasDb = await mongoose.createConnection(ATLAS_URI).asPromise();
    
    // Bind models to atlas DB connection
    const AtlasUser = atlasDb.model('User', User.schema);
    const AtlasProduct = atlasDb.model('Product', Product.schema);
    const AtlasCategory = atlasDb.model('Category', Category.schema);
    const AtlasOrder = atlasDb.model('Order', Order.schema);

    console.log('🔄 Fetching data from local database...');
    const users = await LocalUser.find().lean();
    const products = await LocalProduct.find().lean();
    const categories = await LocalCategory.find().lean();
    const orders = await LocalOrder.find().lean();

    console.log(`📦 Found: ${users.length} users, ${products.length} products, ${categories.length} categories, ${orders.length} orders.`);

    console.log('🚀 Transferring to Atlas...');
    
    if (users.length > 0) {
      await AtlasUser.deleteMany({});
      await AtlasUser.insertMany(users);
      console.log('✅ Users transferred');
    }
    
    if (products.length > 0) {
      await AtlasProduct.deleteMany({});
      await AtlasProduct.insertMany(products);
      console.log('✅ Products transferred');
    }
    
    if (categories.length > 0) {
      await AtlasCategory.deleteMany({});
      await AtlasCategory.insertMany(categories);
      console.log('✅ Categories transferred');
    }
    
    if (orders.length > 0) {
      await AtlasOrder.deleteMany({});
      await AtlasOrder.insertMany(orders);
      console.log('✅ Orders transferred');
    }

    console.log('🎉 Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
