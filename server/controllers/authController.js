import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, email, password'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        const user = await User.create({
            name,
            email: normalizedEmail,
            password
        });

        if (user) {
            const token = generateToken(user._id);

            return res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    wishlist: user.wishlist,
                    cart: user.cart
                },
                token
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid user data'
            });
        }
    } catch (error) {
        console.error('Register Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error during registration'
        });
    }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);

            return res.status(200).json({
                success: true,
                message: 'Login successful',
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    wishlist: user.wishlist,
                    cart: user.cart
                },
                token
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error during login'
        });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (user) {
            return res.status(200).json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    wishlist: user.wishlist,
                    cart: user.cart,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        console.error('Profile Error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error fetching profile'
        });
    }
};
