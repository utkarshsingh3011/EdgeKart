import Message from '../models/Message.js';

// @desc    Submit a new contact inquiry / message
// @route   POST /api/messages
// @access  Public
export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message fields are required'
      });
    }

    const newMessage = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully. Our team will get back to you shortly.',
      data: newMessage
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry',
      error: error.message
    });
  }
};
