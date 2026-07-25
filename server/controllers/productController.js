import mongoose from 'mongoose';
import Product from '../models/Product.js';

// Safe product finder by MongoDB ObjectId or fallback customId/sku without CastError
const findProductByAnyId = async (id) => {
  let product = null;
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    product = await Product.findById(id);
  }
  if (!product && id) {
    product = await Product.findOne({ $or: [{ customId: id }, { sku: id }] });
  }
  return product;
};

// @desc    Get all products with pagination, filtering, sorting, and search
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      stockStatus,
      sortBy,
      q,
      search,
    } = req.query;

    const query = { isActive: true };

    // 1. Category Filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // 2. Keyword Search
    const searchKeyword = q || search;
    if (searchKeyword && searchKeyword.trim()) {
      const searchRegex = new RegExp(searchKeyword.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { brand: searchRegex },
        { tags: searchRegex },
        { sku: searchRegex },
      ];
    }

    // 3. Price Range Filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    // 4. Rating Filter
    if (minRating !== undefined) {
      query.rating = { $gte: Number(minRating) };
    }

    // 5. In-Stock / Stock Status Filter
    if (stockStatus === 'inStock' || inStock === 'true' || inStock === true) {
      query.stock = { $gt: 0 };
    } else if (stockStatus === 'lowStock') {
      query.stock = { $gt: 0, $lte: 5 };
    } else if (stockStatus === 'outOfStock' || inStock === 'false' || inStock === false) {
      query.stock = { $eq: 0 };
    }

    // 6. Featured Filter
    const { featured } = req.query;
    if (featured === 'true' || featured === true) {
      query.featured = true;
    } else if (featured === 'false' || featured === false) {
      query.featured = false;
    }

    // Sorting
    let sortOptions = {};
    switch (sortBy) {
      case 'price-low':
        sortOptions = { price: 1 };
        break;
      case 'price-high':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1 };
        break;
      case 'popular':
        sortOptions = { reviewsCount: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'featured':
      default:
        sortOptions = { featured: -1, createdAt: -1 };
        break;
    }

    // Pagination calculations
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalProducts / limitNum) || 1;

    return res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      page: pageNum,
      totalPages,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
      error: error.message,
    });
  }
};

// @desc    Get single product by ID (MongoDB _id or customId/sku)
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    let product = null;

    // Check by Mongoose ObjectId or customId / id
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      product = await Product.findOne({
        $or: [{ customId: id }, { sku: id }],
        isActive: true,
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      stockValidation: {
        inStock: product.stock > 0,
        stockCount: product.stock,
      },
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching product',
      error: error.message,
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      $or: [{ featured: true }, { isBestSeller: true }],
    })
      .sort({ rating: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching featured products',
      error: error.message,
    });
  }
};

// @desc    Search products by query string
// @route   GET /api/products/search?q=
// @access  Public
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const searchRegex = new RegExp(q.trim(), 'i');
    const products = await Product.find({
      isActive: true,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { brand: searchRegex },
        { tags: searchRegex },
        { sku: searchRegex },
      ],
    }).limit(20);

    return res.status(200).json({
      success: true,
      count: products.length,
      query: q,
      data: products,
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error searching products',
      error: error.message,
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const query = { isActive: true };
    if (category && category !== 'All') {
      query.category = category;
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      category,
      count: products.length,
      totalProducts,
      page: pageNum,
      totalPages: Math.ceil(totalProducts / limitNum) || 1,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching category products',
      error: error.message,
    });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    if (productData.isNew !== undefined) {
      productData.isNewProduct = productData.isNew;
    }
    if (productData.specs && !productData.specifications) {
      productData.specifications = productData.specs;
    }

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to create product',
    });
  }
};

// @desc    Update a product by ID
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await findProductByAnyId(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const updateData = { ...req.body };
    if (updateData.isNew !== undefined) {
      updateData.isNewProduct = updateData.isNew;
    }
    if (updateData.specs && !updateData.specifications) {
      updateData.specifications = updateData.specs;
    }

    Object.assign(product, updateData);
    const updatedProduct = await product.save();
    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update product',
    });
  }
};

// @desc    Delete a product by ID
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let product = await findProductByAnyId(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await Product.findByIdAndDelete(product._id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete product',
    });
  }
};

// @desc    Update product stock count
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
export const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock === null || Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid non-negative stock count is required',
      });
    }

    const product = await findProductByAnyId(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.stock = Number(stock);
    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product stock updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product stock:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update stock',
    });
  }
};

// @desc    Toggle product featured status
// @route   PATCH /api/products/:id/featured
// @access  Private/Admin
export const toggleFeaturedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await findProductByAnyId(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    product.featured = !product.featured;
    const updatedProduct = await product.save();

    return res.status(200).json({
      success: true,
      message: `Product featured status set to ${product.featured}`,
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to toggle featured status',
    });
  }
};

