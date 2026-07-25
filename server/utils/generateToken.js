import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'edgekart_secret_key_2026';
    return jwt.sign({ id }, secret, {
        expiresIn: '30d'
    });
};

export default generateToken;
