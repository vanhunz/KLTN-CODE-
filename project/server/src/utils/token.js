const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_tam_thoi';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

const signAccessToken = (payload) =>
	jwt.sign(payload, JWT_SECRET, {
		expiresIn: JWT_EXPIRES_IN,
	});

const verifyAccessToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = {
	signAccessToken,
	verifyAccessToken,
};
