import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    // Pass through CORS preflight OPTIONS requests without requiring authentication
    if (req.method === 'OPTIONS') {
        return next();
    }

    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            if (!token || token === 'null' || token === 'undefined') {
                return res.status(401).json({
                    success: false,
                    message: 'Not authorized, invalid token'
                });
            }

            const secret = process.env.JWT_SECRET || 'edgekart_secret_key_2026';
            const decoded = jwt.verify(token, secret);

            const userId = decoded.id || decoded._id || decoded.userId;

            req.user = await User.findById(userId).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Not authorized, user not found'
                });
            }

            if (req.user.isBlocked) {
                return res.status(403).json({
                    success: false,
                    message: 'Your account has been blocked by an administrator.'
                });
            }

            return next();
        } catch (error) {
            console.error('JWT Verification Error:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided'
        });
    }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'Access denied. Administrative privileges required.'
    });
};
