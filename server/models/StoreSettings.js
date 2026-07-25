import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema(
  {
    // Store Information
    storeName: {
      type: String,
      default: 'EdgeKart Hardware Store',
      trim: true
    },
    storeDescription: {
      type: String,
      default: 'Premium Microcontrollers, Sensors, and Embedded Development Boards',
      trim: true
    },
    supportEmail: {
      type: String,
      default: 'support@edgekart.io',
      trim: true,
      lowercase: true
    },
    supportPhone: {
      type: String,
      default: '+91 98765 43210',
      trim: true
    },
    companyAddress: {
      type: String,
      default: 'Innovation Tech Park, Sector 62, Noida, UP - 201309',
      trim: true
    },
    gstNumber: {
      type: String,
      default: '09AAACE1234F1Z5',
      trim: true
    },
    website: {
      type: String,
      default: 'https://edgekart.io',
      trim: true
    },

    // Business Settings
    currency: {
      type: String,
      default: '₹ (INR)'
    },
    taxPercentage: {
      type: Number,
      default: 18,
      min: 0,
      max: 100
    },
    shippingCharge: {
      type: Number,
      default: 99,
      min: 0
    },
    freeShippingThreshold: {
      type: Number,
      default: 999,
      min: 0
    },
    codEnabled: {
      type: Boolean,
      default: true
    },

    // Inventory Settings
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 1
    },
    autoHideOutOfStock: {
      type: Boolean,
      default: false
    },
    defaultProductStatus: {
      type: String,
      enum: ['Active', 'Draft'],
      default: 'Active'
    },

    // Orders Settings
    autoConfirmOrders: {
      type: Boolean,
      default: true
    },
    autoUpdateInventory: {
      type: Boolean,
      default: true
    },
    allowOrderCancellation: {
      type: Boolean,
      default: true
    },

    // Notifications Settings
    emailNotifications: {
      type: Boolean,
      default: true
    },
    newOrderAlerts: {
      type: Boolean,
      default: true
    },
    lowStockAlerts: {
      type: Boolean,
      default: true
    },
    newsletterNotifications: {
      type: Boolean,
      default: true
    },

    // Security Settings
    sessionTimeout: {
      type: Number,
      default: 60,
      min: 5,
      max: 1440
    },
    requireStrongPasswords: {
      type: Boolean,
      default: true
    },
    enableAdminActivityLogs: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);

export default StoreSettings;
