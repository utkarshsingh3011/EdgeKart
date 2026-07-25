import Subscriber from '../models/Subscriber.js';

// Regex pattern for validating email addresses
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// @desc    Subscribe to newsletter (Public Storefront)
// @route   POST /api/newsletter or POST /api/newsletter/subscribe
// @access  Public
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email, name = '' } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter an email address.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address (e.g. user@example.com).'
      });
    }

    // Check if subscriber already exists in database
    const existingSubscriber = await Subscriber.findOne({ email: cleanEmail });

    if (existingSubscriber) {
      return res.status(409).json({
        success: false,
        message: 'This email is already subscribed to the newsletter.'
      });
    }

    // Create new subscriber record
    const subscriber = await Subscriber.create({
      email: cleanEmail,
      name: name ? name.trim() : '',
      status: 'Subscribed'
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to the EdgeKart Developer Club!',
      data: subscriber
    });
  } catch (error) {
    // Handle MongoDB duplicate key error (code 11000)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This email is already subscribed to the newsletter.'
      });
    }

    console.error('Error subscribing to newsletter:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process subscription request. Please try again.',
      error: error.message
    });
  }
};

// @desc    Get all newsletter subscribers (Admin List)
// @route   GET /api/newsletter
// @access  Private/Admin
export const getNewsletterSubscribers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sort = 'newest'
    } = req.query;

    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ email: searchRegex }, { name: searchRegex }];
    }

    const sortOptions = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalSubscribers = await Subscriber.countDocuments();
    const activeSubscribers = await Subscriber.countDocuments({ status: 'Subscribed' });
    const unsubscribedCount = await Subscriber.countDocuments({ status: 'Unsubscribed' });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newThisMonthCount = await Subscriber.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    const filteredTotal = await Subscriber.countDocuments(query);
    const subscribers = await Subscriber.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(filteredTotal / limitNum) || 1;

    return res.status(200).json({
      success: true,
      count: subscribers.length,
      totalSubscribers,
      activeSubscribers,
      unsubscribedCount,
      newThisMonthCount,
      filteredTotal,
      page: pageNum,
      totalPages,
      subscribers
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching subscribers',
      error: error.message
    });
  }
};
