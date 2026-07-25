import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: 'default'
  },
  imageId: {
    type: String,
    default: 'default'
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      address: '101 Prototype Lab, Silicon Valley',
      city: 'Bangalore',
      postalCode: '560001',
      country: 'India'
    }
  },
  paymentMethod: {
    type: String,
    default: 'Online Payment'
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Failed', 'Refunded'],
    default: 'Paid'
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0
  },
  discountAmount: {
    type: Number,
    required: true,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['Ordered', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Ordered'
  }
}, {
  timestamps: true
});

// Virtual field for frontend backward compatibility: `id` (returns _id)
orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Virtual field for `price` alias of `totalPrice`
orderSchema.virtual('price').get(function () {
  return this.totalPrice;
});

// Virtual field for `date` alias of `createdAt`
orderSchema.virtual('date').get(function () {
  return this.createdAt;
});

orderSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    ret.price = ret.totalPrice;
    ret.date = ret.createdAt;
    delete ret.__v;
    return ret;
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
