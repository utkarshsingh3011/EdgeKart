import mongoose from 'mongoose';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Create new order (Checkout)
// @route   POST /api/orders/checkout or POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.product');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.cart || user.cart.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Your cart is empty. Cannot process checkout.'
            });
        }

        // 1. Stock Validation: Check if every item in cart has sufficient stock
        for (const item of user.cart) {
            if (!item.product) {
                return res.status(400).json({
                    success: false,
                    message: 'Cart contains an invalid or removed product'
                });
            }

            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for "${item.product.name}". Available stock: ${item.product.stock}, requested: ${item.quantity}.`
                });
            }
        }

        // 2. Calculations
        const itemsPrice = user.cart.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );

        const discountAmount = Number(req.body.discountAmount) || 0;
        const shippingPrice = itemsPrice > 999 || itemsPrice === 0 ? 0 : 99;
        const taxPrice = Math.round((itemsPrice - discountAmount) * 0.18);
        const totalPrice = Math.max(0, itemsPrice - discountAmount + shippingPrice + taxPrice);

        // 3. Map Order Items
        const orderItems = user.cart.map((item) => {
            const prod = item.product;
            const img = prod.images && prod.images.length > 0 ? prod.images[0] : 'default';
            const imgId = prod.customId || prod.imageId || prod.sku || prod._id.toString();
            return {
                product: prod._id,
                name: prod.name,
                price: prod.price,
                quantity: item.quantity,
                image: img,
                imageId: imgId
            };
        });

        // Generate Unique Order Number
        const orderNumber = `EK-ORD-${Math.floor(10000 + Math.random() * 90000)}`;

        // 4. Create Order Document
        const order = await Order.create({
            user: req.user._id,
            orderNumber,
            items: orderItems,
            itemsPrice,
            taxPrice,
            shippingPrice,
            discountAmount,
            totalPrice,
            status: 'Ordered',
            shippingAddress: req.body.shippingAddress || {
                address: '101 Prototype Lab, Silicon Valley',
                city: 'Bangalore',
                postalCode: '560001',
                country: 'India'
            },
            paymentMethod: req.body.paymentMethod || 'Online Payment'
        });

        // 5. Reduce product stock in database
        for (const item of user.cart) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }
            });
        }

        // 6. Clear authenticated user's cart
        user.cart = [];
        await user.save();

        return res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        console.error('Error during checkout:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error processing checkout',
            error: error.message
        });
    }
};

// @desc    Get authenticated user's order history
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error fetching orders',
            error: error.message
        });
    }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        let order = null;
        if (mongoose.Types.ObjectId.isValid(id)) {
            order = await Order.findOne({ _id: id, user: req.user._id });
        }

        if (!order) {
            order = await Order.findOne({ orderNumber: id, user: req.user._id });
        }

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error fetching order',
            error: error.message
        });
    }
};
