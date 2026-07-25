import mongoose from 'mongoose';
import Product from '../models/Product.js';
import User from '../models/User.js';

// Helper function to find a product by ObjectId, customId, or sku
const findProduct = async (id) => {
    if (!id) return null;
    if (mongoose.Types.ObjectId.isValid(id)) {
        const product = await Product.findById(id);
        if (product) return product;
    }
    return await Product.findOne({
        $or: [{ customId: id }, { sku: id }]
    });
};

// @desc    Get authenticated user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.product');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            count: user.cart.length,
            cart: user.cart
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error fetching cart',
            error: error.message
        });
    }
};

// @desc    Add item to cart or increment quantity if already exists
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
    try {
        const body = req.body || {};
        const productId = body.productId || body.product || body.id;
        const quantity = body.quantity;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const product = await findProduct(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const quantityNum = quantity !== undefined ? parseInt(quantity, 10) : 1;

        if (isNaN(quantityNum) || quantityNum < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const existingItemIndex = user.cart.findIndex(
            (item) => item.product.toString() === product._id.toString()
        );

        if (existingItemIndex > -1) {
            user.cart[existingItemIndex].quantity += quantityNum;
        } else {
            user.cart.push({
                product: product._id,
                quantity: quantityNum
            });
        }

        await user.save();
        await user.populate('cart.product');

        return res.status(200).json({
            success: true,
            message: 'Item added to cart',
            cart: user.cart
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error adding item to cart',
            error: error.message
        });
    }
};

// @desc    Update quantity of an item in cart
// @route   PATCH /api/cart/:productId
// @access  Private
export const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const body = req.body || {};
        const quantity = body.quantity;

        if (quantity === undefined || quantity === null) {
            return res.status(400).json({
                success: false,
                message: 'Quantity is required'
            });
        }

        const quantityNum = parseInt(quantity, 10);

        if (isNaN(quantityNum) || quantityNum < 1) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be at least 1'
            });
        }

        const product = await findProduct(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const cartIndex = user.cart.findIndex(
            (item) => item.product.toString() === product._id.toString()
        );

        if (cartIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        user.cart[cartIndex].quantity = quantityNum;

        await user.save();
        await user.populate('cart.product');

        return res.status(200).json({
            success: true,
            message: 'Cart updated successfully',
            cart: user.cart
        });
    } catch (error) {
        console.error('Error updating cart item:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error updating cart item',
            error: error.message
        });
    }
};

// @desc    Remove an item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await findProduct(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const cartIndex = user.cart.findIndex(
            (item) => item.product.toString() === product._id.toString()
        );

        if (cartIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        user.cart.splice(cartIndex, 1);

        await user.save();
        await user.populate('cart.product');

        return res.status(200).json({
            success: true,
            message: 'Item removed from cart',
            cart: user.cart
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error removing item from cart',
            error: error.message
        });
    }
};

// @desc    Clear all items from cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.cart = [];

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Cart cleared successfully',
            cart: []
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error clearing cart',
            error: error.message
        });
    }
};
