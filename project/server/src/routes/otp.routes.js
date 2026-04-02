const express = require('express');
const {
    handleSendOtp,
    handleRegisterWithOtp,
    handleForgotPassword,
    handleResetPassword,
} = require('../controllers/otp.controller');

const router = express.Router();

/**
 * POST /api/otp/send-otp
 * Gửi OTP tới email để đăng ký
 * Body: { email }
 */
router.post('/send-otp', handleSendOtp);

/**
 * POST /api/otp/register
 * Đăng ký người dùng với OTP
 * Body: { email, password, otp, fullName }
 */
router.post('/register', handleRegisterWithOtp);

/**
 * POST /api/otp/forgot-password
 * Gửi OTP reset mật khẩu
 * Body: { email }
 */
router.post('/forgot-password', handleForgotPassword);

/**
 * POST /api/otp/reset-password
 * Reset mật khẩu
 * Body: { email, otp, newPassword }
 */
router.post('/reset-password', handleResetPassword);

module.exports = router;
