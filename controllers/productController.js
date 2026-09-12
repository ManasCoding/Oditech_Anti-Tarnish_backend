import Product from '../models/Product.js';
import Review from '../models/Review.js';
import cloudinary, { uploadToCloudinary } from '../middleware/cloudinary.js';

export const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, featured, newArrival, bestSeller, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured) filter.featured = true;
    if (newArrival) filter.newArrival = true;
    if (bestSeller) filter.bestSeller = true;
    if (search) filter.$text = { $search: search };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    let sortOption = {};
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else sortOption = { createdAt: -1 };

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit)).populate('category', 'name slug');
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    if (req.body.imageOrder) {
      let fileIndex = 0;
      const order = Array.isArray(req.body.imageOrder) ? req.body.imageOrder : [req.body.imageOrder];
      const imageResults = [];
      for (const item of order) {
        if (item === 'FILE' && req.files && req.files[fileIndex]) {
          const file = req.files[fileIndex++];
          const result = await uploadToCloudinary(file.path, 'Home/anti-tarnish');
          imageResults.push({ url: result.secure_url, public_id: result.public_id });
        } else if (item.startsWith('URL:')) {
          imageResults.push(item.substring(4));
        }
      }
      productData.images = imageResults.filter(Boolean);
    } else if (req.files && req.files.length > 0) {
      const imageResults = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path, 'Home/anti-tarnish');
        imageResults.push({ url: result.secure_url, public_id: result.public_id });
      }
      productData.images = imageResults;
    }

    if (!productData.slug && productData.name) {
      productData.slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    }

    if (productData.price) productData.price = Number(productData.price);
    if (productData.stock) productData.stock = Number(productData.stock);
    if (productData.shippingCharge !== undefined) productData.shippingCharge = Number(productData.shippingCharge);

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    console.error('CREATE PRODUCT ERROR:', error);
    res.status(500).json({ message: error.message || 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) return res.status(404).json({ message: 'Product not found' });

    let retainedImages = [];

    if (req.body.imageOrder) {
      let fileIndex = 0;
      const order = Array.isArray(req.body.imageOrder) ? req.body.imageOrder : [req.body.imageOrder];
      const imageResults = [];
      for (const item of order) {
        if (item === 'FILE' && req.files && req.files[fileIndex]) {
          const file = req.files[fileIndex++];
          const result = await uploadToCloudinary(file.path, 'Home/anti-tarnish');
          imageResults.push({ url: result.secure_url, public_id: result.public_id });
        } else if (item.startsWith('URL:')) {
          const urlStr = item.substring(4);
          const existingImg = existingProduct.images.find(img => (typeof img === 'string' ? img : img?.url) === urlStr);
          if (existingImg) {
            retainedImages.push(existingImg);
            imageResults.push(existingImg);
          } else {
            imageResults.push(urlStr);
          }
        }
      }
      updateData.images = imageResults.filter(Boolean);
    } else if (req.files && req.files.length > 0) {
      const imageResults = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path, 'Home/anti-tarnish');
        imageResults.push({ url: result.secure_url, public_id: result.public_id });
      }
      updateData.images = imageResults;
    }

    if (updateData.images) {
      const removedImages = existingProduct.images.filter(existing =>
        !retainedImages.some(retained =>
          (typeof existing === 'string' ? existing : existing?.url) === (typeof retained === 'string' ? retained : retained?.url)
        )
      );
      for (const img of removedImages) {
        if (img && img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (err) {
            console.error(`Failed to delete image from Cloudinary: ${img.public_id}`, err);
          }
        }
      }
    }

    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.stock) updateData.stock = Number(updateData.stock);
    if (updateData.shippingCharge !== undefined) updateData.shippingCharge = Number(updateData.shippingCharge);

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('UPDATE PRODUCT ERROR:', error);
    res.status(500).json({ message: error.message || 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img && img.public_id) {
          try {
            await cloudinary.uploader.destroy(img.public_id);
          } catch (err) {
            console.error(`Failed to delete image from Cloudinary: ${img.public_id}`, err);
          }
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = await Review.findOne({ product: productId, user: req.user._id });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product.' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating: Number(rating),
      comment
    });

    const reviews = await Review.find({ product: productId });
    product.reviewCount = reviews.length;
    product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await product.save();

    const populatedReview = await Review.findById(review._id).populate('user', 'name profileImage');
    res.status(201).json({ message: 'Review added', review: populatedReview });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this product.' });
    }
    res.status(400).json({ message: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id }).populate('user', 'name profileImage').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
