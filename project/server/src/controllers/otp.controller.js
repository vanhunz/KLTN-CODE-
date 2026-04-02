const {
    sendOtp,
    registerWithOtp,
    forgotPassword,
    resetPassword,
} = require('../services/otp.service');
const { validateData, sendOtpSchema, registerWithOtpSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validations/otp.schema');

/**
 * POST /send-otp
 * Gửi OTP tới email
 */
const handleSendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate
        const validation = validateData({ email }, sendOtpSchema);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: validation.errors,
            });
        }

        // Gửi OTP
        const result = await sendOtp(email);
        
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error('❌ Lỗi handleSendOtp:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message,
        });
    }
};

/**
 * POST /register
 * Đăng ký người dùng với OTP
 */
const handleRegisterWithOtp = async (req, res) => {
    try {
        const { email, password, otp, fullName, phone, address } = req.body;

        // Validate
        const validation = validateData(
            { email, password, otp, fullName, phone, address },
            registerWithOtpSchema
        );
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: validation.errors,
            });
        }

        // Đăng ký
        const result = await registerWithOtp(email, password, otp, fullName, phone, address);

        if (result.success) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error('❌ Lỗi handleRegisterWithOtp:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message,
        });
    }
};

/**
 * POST /forgot-password
 * Gửi OTP reset mật khẩu
 */
const handleForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate
        const validation = validateData({ email }, forgotPasswordSchema);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: validation.errors,
            });
        }

        // Gửi OTP
        const result = await forgotPassword(email);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error('❌ Lỗi handleForgotPassword:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message,
        });
    }
};

/**
 * POST /reset-password
 * Reset mật khẩu
 */
const handleResetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Validate
        const validation = validateData({ email, otp, newPassword }, resetPasswordSchema);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: 'Dữ liệu không hợp lệ',
                errors: validation.errors,
            });
        }

        // Reset mật khẩu
        const result = await resetPassword(email, otp, newPassword);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        console.error('❌ Lỗi handleResetPassword:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message,
        });
    }
};

module.exports = {
    handleSendOtp,
    handleRegisterWithOtp,
    handleForgotPassword,
    handleResetPassword,
};
