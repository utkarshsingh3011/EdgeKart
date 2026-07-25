import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

// @desc    Subscribe to newsletter (Public Storefront)
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email, name = '' } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    let subscriber = await NewsletterSubscriber.findOne({ email: cleanEmail });

    if (subscriber) {
      if (subscriber.status === 'Subscribed') {
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed to the EdgeKart Newsletter!',
          data: subscriber
        });
      }

      // Re-subscribe if previously unsubscribed
      subscriber.status = 'Subscribed';
      if (name && name.trim()) subscriber.name = name.trim();
      await subscriber.save();

      return res.status(200).json({
        success: true,
        message: 'Welcome back! Your subscription has been reactivated.',
        data: subscriber
      });
    }

    // Create new subscriber
    subscriber = await NewsletterSubscriber.create({
      email: cleanEmail,
      name: name.trim(),
      status: 'Subscribed'
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to the EdgeKart Developer Club!',
      data: subscriber
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process subscription request',
      error: error.message
    });
  }
};
