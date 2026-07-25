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

// @desc    Get authenticated user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            count: user.wishlist.length,
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error fetching wishlist',
            error: error.message
        });
    }
};

// @desc    Add product to wishlist (prevents duplicate entries)
// @route   POST /api/wishlist/add
// @access  Private
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

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

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isDuplicate = user.wishlist.some(
            (id) => id.toString() === product._id.toString()
        );

        if (isDuplicate) {
            return res.status(400).json({
                success: false,
                message: 'Product already in wishlist'
            });
        }

        user.wishlist.push(product._id);

        await user.save();
        await user.populate('wishlist');

        return res.status(200).json({
            success: true,
            message: 'Product added to wishlist',
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error adding product to wishlist',
            error: error.message
        });
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res) => {
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

        const itemIndex = user.wishlist.findIndex(
            (id) => id.toString() === product._id.toString()
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in wishlist'
            });
        }

        user.wishlist.splice(itemIndex, 1);

        await user.save();
        await user.populate('wishlist');

        return res.status(200).json({
            success: true,
            message: 'Product removed from wishlist',
            wishlist: user.wishlist
        });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error removing product from wishlist',
            error: error.message
        });
    }
};
