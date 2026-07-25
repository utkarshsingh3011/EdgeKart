import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Message text is required']
    },
    isRead: {
      type: Boolean,
      default: false
    },
    isReplied: {
      type: Boolean,
      default: false
    },
    replyMessage: {
      type: String,
      default: ''
    },
    repliedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
