import mongoose from 'mongoose';

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address'
      ]
    },
    status: {
      type: String,
      enum: ['Subscribed', 'Unsubscribed'],
      default: 'Subscribed'
    }
  },
  {
    timestamps: true
  }
);

const NewsletterSubscriber = mongoose.model(
  'NewsletterSubscriber',
  newsletterSubscriberSchema
);

export default NewsletterSubscriber;
