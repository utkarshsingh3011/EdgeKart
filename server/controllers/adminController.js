import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Message from '../models/Message.js';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import StoreSettings from '../models/StoreSettings.js';

// @desc    Get Admin Dashboard Statistics and Recent Data
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Calculate KPI Metrics
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    
    // Revenue calculation from all orders
    const revenueAggregation = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const revenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    // Pending Orders count (status = 'Ordered' or 'Processing')
    const pendingOrders = await Order.countDocuments({
      status: { $in: ['Ordered', 'Processing'] }
    });

    // Low stock count (stock < 5)
    const lowStockCount = await Product.countDocuments({
      isActive: true,
      stock: { $lt: 5 }
    });

    // 2. Fetch Recent Orders (latest 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    // 3. Fetch Low Stock Products (stock < 5, sorted by stock ascending)
    const lowStockProducts = await Product.find({
      isActive: true,
      stock: { $lt: 5 }
    })
      .sort({ stock: 1 })
      .limit(5);

    // 4. Fetch Recent Users (latest 5 registered users)
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: revenue,
      revenue,
      pendingOrders,
      lowStockProductsCount: lowStockCount,
      lowStockCount,
      kpis: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: revenue,
        revenue,
        pendingOrders,
        lowStockProductsCount: lowStockCount,
        lowStockCount
      },
      recentOrders,
      lowStockProducts,
      recentUsers
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while loading admin dashboard metrics',
      error: error.message
    });
  }
};

// @desc    Get all orders with filtering, search, and pagination for Admin
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAdminOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      paymentStatus,
      dateRange
    } = req.query;

    const query = {};

    // 1. Order Status Filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // 2. Payment Status Filter
    if (paymentStatus && paymentStatus !== 'All') {
      query.paymentStatus = paymentStatus;
    }

    // 3. Date Range Filter
    if (dateRange && dateRange !== 'All') {
      const now = new Date();
      if (dateRange === 'today') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        query.createdAt = { $gte: startOfDay };
      } else if (dateRange === '7days') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        query.createdAt = { $gte: sevenDaysAgo };
      } else if (dateRange === '30days') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        query.createdAt = { $gte: thirtyDaysAgo };
      }
    }

    // 4. Keyword Search (by Order ID or Customer name/email)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      
      // Find matching user IDs by name or email
      const matchingUsers = await User.find({
        $or: [{ name: searchRegex }, { email: searchRegex }]
      }).select('_id');

      const userIds = matchingUsers.map((u) => u._id);

      query.$or = [
        { orderNumber: searchRegex },
        { user: { $in: userIds } }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email avatar role');

    const totalPages = Math.ceil(totalOrders / limitNum) || 1;

    return res.status(200).json({
      success: true,
      count: orders.length,
      totalOrders,
      page: pageNum,
      totalPages,
      orders
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching admin orders',
      error: error.message
    });
  }
};

// @desc    Update Order Status or Payment Status
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    let order = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (status) {
      const validStatuses = ['Ordered', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid order status. Allowed: ${validStatuses.join(', ')}`
        });
      }
      order.status = status;
    }

    if (paymentStatus) {
      const validPaymentStatuses = ['Paid', 'Pending', 'Failed', 'Refunded'];
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid payment status. Allowed: ${validPaymentStatuses.join(', ')}`
        });
      }
      order.paymentStatus = paymentStatus;
    }

    const updatedOrder = await order.save();
    await updatedOrder.populate('user', 'name email avatar');

    return res.status(200).json({
      success: true,
      message: `Order status updated to "${updatedOrder.status}"`,
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating order status',
      error: error.message
    });
  }
};

// @desc    Delete Order
// @route   DELETE /api/admin/orders/:id
// @access  Private/Admin
export const deleteAdminOrder = async (req, res) => {
  try {
    const { id } = req.params;

    let order = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findByIdAndDelete(id);
    }
    if (!order) {
      order = await Order.findOneAndDelete({ orderNumber: id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting admin order:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting order',
      error: error.message
    });
  }
};

// @desc    Get all users with search, role/status filters, sorting & pagination
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAdminUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      status,
      sort = 'newest'
    } = req.query;

    const query = {};

    // Role filter
    if (role && role !== 'All') {
      query.role = role;
    }

    // Account status filter
    if (status && status !== 'All') {
      if (status === 'Blocked') query.isBlocked = true;
      if (status === 'Active') query.isBlocked = { $ne: true };
    }

    // Search filter (name or email)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    // Sort order
    let sortOptions = {};
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    else if (sort === 'alphabetical') sortOptions = { name: 1 };
    else sortOptions = { createdAt: -1 }; // default newest

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalUsers = await User.countDocuments(query);
    const rawUsers = await User.find(query)
      .select('-password')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('wishlist', 'name price images')
      .populate('cart.product', 'name price images');

    // Enrich users with order counts and wishlist/cart stats
    const users = await Promise.all(
      rawUsers.map(async (u) => {
        const ordersCount = await Order.countDocuments({ user: u._id });
        const userObj = u.toObject();
        userObj.id = u._id.toString();
        userObj.ordersCount = ordersCount;
        userObj.wishlistCount = Array.isArray(u.wishlist) ? u.wishlist.length : 0;
        userObj.cartCount = Array.isArray(u.cart) ? u.cart.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0;
        return userObj;
      })
    );

    // If sorting by most orders, sort the enriched page array
    if (sort === 'most-orders') {
      users.sort((a, b) => b.ordersCount - a.ordersCount);
    }

    const totalPages = Math.ceil(totalUsers / limitNum) || 1;

    return res.status(200).json({
      success: true,
      count: users.length,
      totalUsers,
      page: pageNum,
      totalPages,
      users
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching admin users',
      error: error.message
    });
  }
};

// @desc    Get detailed user profile, order history, and cart/wishlist
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getAdminUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('-password')
      .populate('wishlist')
      .populate('cart.product');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const orders = await Order.find({ user: id }).sort({ createdAt: -1 });

    const userObj = user.toObject();
    userObj.id = user._id.toString();
    userObj.ordersCount = orders.length;

    return res.status(200).json({
      success: true,
      user: userObj,
      orders
    });
  } catch (error) {
    console.error('Error fetching user detail:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching user details',
      error: error.message
    });
  }
};

// @desc    Update user role (Promote / Demote)
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Allowed values: admin, user'
      });
    }

    // Safety check 1: Cannot demote logged-in admin
    if (req.user._id.toString() === id && role === 'user') {
      return res.status(400).json({
        success: false,
        message: 'You cannot demote your own active admin account.'
      });
    }

    // Safety check 2: Prevent demoting the last admin account
    if (role === 'user') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot demote the last remaining admin account.'
        });
      }
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User role updated to "${role}"`,
      user
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating user role',
      error: error.message
    });
  }
};

// @desc    Block or Unblock user account
// @route   PATCH /api/admin/users/:id/block
// @access  Private/Admin
export const toggleUserBlock = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    // Safety check: Cannot block logged-in admin
    if (req.user._id.toString() === id && isBlocked) {
      return res.status(400).json({
        success: false,
        message: 'You cannot block your own active admin account.'
      });
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isBlocked = !!isBlocked;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User account ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user
    });
  } catch (error) {
    console.error('Error toggling user block:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating user block status',
      error: error.message
    });
  }
};

// @desc    Delete User
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Safety check 1: Cannot delete logged-in admin
    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own active admin account.'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Safety check 2: Prevent deleting the last admin account
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last remaining admin account.'
        });
      }
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting user',
      error: error.message
    });
  }
};

// Seed sample messages if empty
const seedSampleMessages = async () => {
  const count = await Message.countDocuments();
  if (count === 0) {
    await Message.insertMany([
      {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@gmail.com',
        subject: 'Inquiry about ESP32 Development Board Stock',
        message: 'Hi EdgeKart Team,\n\nI am planning to buy 20 units of the ESP32-WROOM Development Board for a robotics workshop next month. Do you offer bulk discounts or have sufficient stock available?\n\nThanks,\nAarav',
        isRead: false,
        isReplied: false
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@techsolutions.io',
        subject: 'Compatibility of PIR Sensor with Arduino Uno',
        message: 'Hello Support,\n\nCould you confirm if the HC-SR501 PIR Motion Sensor module operates at 3.3V or if it requires 5V input from the Arduino microcontroller pin?\n\nRegards,\nPriya',
        isRead: true,
        isReplied: true,
        replyMessage: 'Hi Priya, the HC-SR501 module operates with 5V-20V DC input, while its output pin provides 3.3V TTL signal, making it safe for both Arduino (5V) and ESP32/Raspberry Pi (3.3V).',
        repliedAt: new Date(Date.now() - 3600000 * 24)
      },
      {
        name: 'Rohan Mehta',
        email: 'rohan.m@outlook.com',
        subject: 'Order Tracking Query #ORD-84920',
        message: 'Hi,\n\nI placed an order two days ago for a set of OLED Displays and a step-down buck converter. Could you please provide the courier tracking link?\n\nThanks,\nRohan',
        isRead: false,
        isReplied: false
      }
    ]);
  }
};

// @desc    Get all messages with search, filter (read/unread, replied), sorting & pagination
// @route   GET /api/admin/messages
// @access  Private/Admin
export const getAdminMessages = async (req, res) => {
  try {
    await seedSampleMessages();

    const {
      page = 1,
      limit = 10,
      search,
      read,
      replied,
      sort = 'newest'
    } = req.query;

    const query = {};

    // Filter Read / Unread
    if (read && read !== 'All') {
      if (read === 'read') query.isRead = true;
      if (read === 'unread') query.isRead = false;
    }

    // Filter Replied / Pending
    if (replied && replied !== 'All') {
      if (replied === 'replied') query.isReplied = true;
      if (replied === 'pending') query.isReplied = false;
    }

    // Search query
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex }
      ];
    }

    const sortOptions = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalMessages = await Message.countDocuments(query);
    const unreadCount = await Message.countDocuments({ isRead: false });
    const pendingReplyCount = await Message.countDocuments({ isReplied: false });

    const messages = await Message.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalMessages / limitNum) || 1;

    return res.status(200).json({
      success: true,
      count: messages.length,
      totalMessages,
      unreadCount,
      pendingReplyCount,
      page: pageNum,
      totalPages,
      messages
    });
  } catch (error) {
    console.error('Error fetching admin messages:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching messages',
      error: error.message
    });
  }
};

// @desc    Get single message by ID and automatically mark as read
// @route   GET /api/admin/messages/:id
// @access  Private/Admin
export const getAdminMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const msg = await Message.findById(id);

    if (!msg) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (!msg.isRead) {
      msg.isRead = true;
      await msg.save();
    }

    return res.status(200).json({
      success: true,
      message: msg
    });
  } catch (error) {
    console.error('Error fetching message detail:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching message',
      error: error.message
    });
  }
};

// @desc    Update message read status (Read / Unread)
// @route   PATCH /api/admin/messages/:id/read
// @access  Private/Admin
export const updateMessageReadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    const msg = await Message.findById(id);
    if (!msg) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    msg.isRead = !!isRead;
    await msg.save();

    return res.status(200).json({
      success: true,
      message: `Message marked as ${msg.isRead ? 'read' : 'unread'}`,
      data: msg
    });
  } catch (error) {
    console.error('Error updating read status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating read status',
      error: error.message
    });
  }
};

// @desc    Update message replied status
// @route   PATCH /api/admin/messages/:id/reply
// @access  Private/Admin
export const updateMessageRepliedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isReplied = true, replyMessage } = req.body;

    const msg = await Message.findById(id);
    if (!msg) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    msg.isReplied = !!isReplied;
    if (replyMessage) {
      msg.replyMessage = replyMessage;
    }
    msg.repliedAt = isReplied ? new Date() : null;
    msg.isRead = true; // replying implicitly marks message as read

    await msg.save();

    return res.status(200).json({
      success: true,
      message: `Message marked as ${msg.isReplied ? 'replied' : 'pending reply'}`,
      data: msg
    });
  } catch (error) {
    console.error('Error updating replied status:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating reply status',
      error: error.message
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/admin/messages/:id
// @access  Private/Admin
export const deleteAdminMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const msg = await Message.findByIdAndDelete(id);

    if (!msg) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting message',
      error: error.message
    });
  }
};

// Seed sample subscribers if collection is empty
const seedSampleNewsletterSubscribers = async () => {
  const count = await NewsletterSubscriber.countDocuments();
  if (count === 0) {
    await NewsletterSubscriber.insertMany([
      {
        name: 'Devraj Ananthan',
        email: 'devraj.ananthan@gmail.com',
        status: 'Subscribed',
        createdAt: new Date(Date.now() - 3600000 * 24 * 5)
      },
      {
        name: 'Neha Kapoor',
        email: 'neha.k@roboticslab.org',
        status: 'Subscribed',
        createdAt: new Date(Date.now() - 3600000 * 24 * 12)
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@hardwarehub.in',
        status: 'Unsubscribed',
        createdAt: new Date(Date.now() - 3600000 * 24 * 40)
      },
      {
        name: 'Ananya Roy',
        email: 'ananya.roy@iotdesigns.io',
        status: 'Subscribed',
        createdAt: new Date()
      }
    ]);
  }
};

// @desc    Get all newsletter subscribers with search, status filters, metrics & pagination
// @route   GET /api/admin/newsletter
// @access  Private/Admin
export const getAdminNewsletterSubscribers = async (req, res) => {
  try {
    await seedSampleNewsletterSubscribers();

    const {
      page = 1,
      limit = 10,
      search,
      status,
      sort = 'newest'
    } = req.query;

    const query = {};

    // Filter status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Search email or name
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ email: searchRegex }, { name: searchRegex }];
    }

    const sortOptions = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Calculate metrics
    const totalSubscribers = await NewsletterSubscriber.countDocuments();
    const activeSubscribers = await NewsletterSubscriber.countDocuments({ status: 'Subscribed' });
    const unsubscribedCount = await NewsletterSubscriber.countDocuments({ status: 'Unsubscribed' });

    // New this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newThisMonthCount = await NewsletterSubscriber.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    const filteredTotal = await NewsletterSubscriber.countDocuments(query);
    const subscribers = await NewsletterSubscriber.find(query)
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
    console.error('Error fetching admin newsletter subscribers:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching subscribers',
      error: error.message
    });
  }
};

// @desc    Manually add new subscriber (Admin)
// @route   POST /api/admin/newsletter
// @access  Private/Admin
export const addAdminNewsletterSubscriber = async (req, res) => {
  try {
    const { email, name = '', status = 'Subscribed' } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await NewsletterSubscriber.findOne({ email: cleanEmail });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Subscriber with email "${cleanEmail}" already exists.`
      });
    }

    const subscriber = await NewsletterSubscriber.create({
      email: cleanEmail,
      name: name.trim(),
      status: ['Subscribed', 'Unsubscribed'].includes(status) ? status : 'Subscribed'
    });

    return res.status(201).json({
      success: true,
      message: 'Subscriber added successfully',
      data: subscriber
    });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add subscriber',
      error: error.message
    });
  }
};

// @desc    Update subscriber status (Subscribed / Unsubscribed)
// @route   PATCH /api/admin/newsletter/:id/status
// @access  Private/Admin
export const updateAdminNewsletterStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Subscribed', 'Unsubscribed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status specified. Allowed values: Subscribed, Unsubscribed'
      });
    }

    const subscriber = await NewsletterSubscriber.findById(id);
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber record not found'
      });
    }

    subscriber.status = status;
    await subscriber.save();

    return res.status(200).json({
      success: true,
      message: `Subscriber status updated to "${status}"`,
      data: subscriber
    });
  } catch (error) {
    console.error('Error updating subscriber status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update subscriber status',
      error: error.message
    });
  }
};

// @desc    Delete subscriber record
// @route   DELETE /api/admin/newsletter/:id
// @access  Private/Admin
export const deleteAdminNewsletterSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    const subscriber = await NewsletterSubscriber.findByIdAndDelete(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber record not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Subscriber record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete subscriber',
      error: error.message
    });
  }
};

// @desc    Get store administration settings (Single Document)
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getStoreSettings = async (req, res) => {
  try {
    let settings = await StoreSettings.findOne();

    if (!settings) {
      settings = await StoreSettings.create({});
    }

    return res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error fetching store settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching store settings',
      error: error.message
    });
  }
};

// @desc    Update store administration settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateStoreSettings = async (req, res) => {
  try {
    let settings = await StoreSettings.findOne();

    if (!settings) {
      settings = new StoreSettings({});
    }

    Object.assign(settings, req.body);
    const updatedSettings = await settings.save();

    return res.status(200).json({
      success: true,
      message: 'Store settings updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Error updating store settings:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update store settings',
      error: error.message
    });
  }
};
