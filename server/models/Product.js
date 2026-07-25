import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    brand: {
      type: String,
      default: 'EdgeKart',
      trim: true,
    },
    images: {
      type: [String],
      default: ['default'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: [0, 'Reviews count cannot be negative'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Supporting fields for enhanced UI compatibility
    features: {
      type: [String],
      default: [],
    },
    packageContents: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    sku: {
      type: String,
      default: '',
    },
    isNewProduct: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    customId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field for frontend backward compatibility: `id` (returns customId or _id)
productSchema.virtual('id').get(function () {
  return this.customId || this._id.toHexString();
});

// Canonical virtual field for SVG product image artwork
productSchema.virtual('imageId').get(function () {
  return this.customId || this.sku || this._id.toHexString();
});

// Virtual field for stock check: `isStock` (true if stock > 0)
productSchema.virtual('isStock').get(function () {
  return this.stock > 0;
});

// Ensure virtuals are included when converting to JSON
productSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    const objectIdStr = doc._id ? doc._id.toString() : (ret._id ? ret._id.toString() : '');
    ret._id = objectIdStr;
    ret.id = objectIdStr || ret.customId;
    ret.imageId = ret.customId || ret.sku || objectIdStr;
    ret.slug = ret.imageId;
    ret.isStock = ret.stock > 0;
    ret.stockCount = ret.stock;
    ret.specs = ret.specifications || {};
    ret.isNew = ret.isNewProduct !== undefined ? ret.isNewProduct : false;
    delete ret.__v;
    return ret;
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
