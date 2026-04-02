const { verifyAccessToken } = require('../utils/token');

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : null;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Ban chua dang nhap',
            });
        }

        const decoded = verifyAccessToken(token);

        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token khong hop le hoac da het han',
        });
    }
};

module.exports = authMiddleware;
