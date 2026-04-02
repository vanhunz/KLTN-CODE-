const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateOtp, getOtpExpiryTime, isOtpValid } = require('../utils/otp');
const { sendOtpEmail } = require('../integrations/email');

const prisma = new PrismaClient();

/**
 * Gửi OTP tới email
 * @param {string} email - Địa chỉ email
 * @returns {Promise<{success: boolean, message: string}>}
 */
const sendOtp = async (email) => {
    try {
        // Tạo OTP
        const otp = generateOtp();
        const expiryTime = getOtpExpiryTime();

        // Xóa OTP cũ của email này (nếu có)
        await prisma.emailVerification.deleteMany({
            where: { email },
        });

        // Lưu OTP vào database
        await prisma.emailVerification.create({
            data: {
                email,
                otp,
                expiredAt: expiryTime,
            },
        });

        // Gửi email
        const emailSent = await sendOtpEmail(email, otp, 'register');
        if (!emailSent) {
            return {
                success: false,
                message: 'Lỗi gửi email, vui lòng thử lại',
            };
        }

        return {
            success: true,
            message: 'OTP đã được gửi tới email của bạn',
        };
    } catch (error) {
        console.error('❌ Lỗi sendOtp:', error);
        return {
            success: false,
            message: 'Lỗi khi gửi OTP',
            error: error.message,
        };
    }
};

/**
 * Đăng ký người dùng với OTP
 * @param {string} email - Địa chỉ email
 * @param {string} password - Mật khẩu
 * @param {string} otp - Mã OTP
 * @param {string} fullName - Họ tên
 * @param {string} phone - Số điện thoại
 * @param {string} address - Địa chỉ
 * @returns {Promise<{success: boolean, message: string, user?: object}>}
 */
const registerWithOtp = async (email, password, otp, fullName, phone, address) => {
    try {
        // 1. Kiểm tra email đã tồn tại chưa
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                success: false,
                message: 'Email đã được đăng ký',
            };
        }

        // 2. Kiểm tra OTP
        const emailVerification = await prisma.emailVerification.findFirst({
            where: { email },
            orderBy: { createdAt: 'desc' },
        });

        if (!emailVerification) {
            return {
                success: false,
                message: 'OTP không tồn tại, vui lòng yêu cầu OTP mới',
            };
        }

        if (emailVerification.otp !== otp) {
            return {
                success: false,
                message: 'OTP không chính xác',
            };
        }

        if (!isOtpValid(emailVerification.expiredAt)) {
            return {
                success: false,
                message: 'OTP đã hết hạn, vui lòng yêu cầu OTP mới',
            };
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 4. Tạo user với đầy đủ thông tin
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                fullName,
                phone,
                address,
                status: 'ACTIVE', // Đánh dấu là đã xác thực
                roleId: 2, // CUSTOMER role (giả sử roleId = 2 là CUSTOMER)
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                address: true,
                status: true,
                createdAt: true,
            },
        });

        // 5. Xóa OTP khỏi database sau khi sử dụng
        await prisma.emailVerification.deleteMany({
            where: { email },
        });

        return {
            success: true,
            message: 'Đăng ký thành công',
            user,
        };
    } catch (error) {
        console.error('❌ Lỗi registerWithOtp:', error);
        return {
            success: false,
            message: 'Lỗi khi đăng ký',
            error: error.message,
        };
    }
};

/**
 * Gửi OTP reset mật khẩu
 * @param {string} email - Địa chỉ email
 * @returns {Promise<{success: boolean, message: string}>}
 */
const forgotPassword = async (email) => {
    try {
        // Kiểm tra email tồn tại
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return {
                success: false,
                message: 'Email không tồn tại trong hệ thống',
            };
        }

        // Tạo OTP
        const otp = generateOtp();
        const expiryTime = getOtpExpiryTime();

        // Xóa OTP cũ của email này (nếu có)
        await prisma.emailVerification.deleteMany({
            where: { email },
        });

        // Lưu OTP vào database
        await prisma.emailVerification.create({
            data: {
                email,
                otp,
                expiredAt: expiryTime,
            },
        });

        // Gửi email
        const emailSent = await sendOtpEmail(email, otp, 'reset-password');
        if (!emailSent) {
            return {
                success: false,
                message: 'Lỗi gửi email, vui lòng thử lại',
            };
        }

        return {
            success: true,
            message: 'Mã reset mật khẩu đã được gửi tới email của bạn',
        };
    } catch (error) {
        console.error('❌ Lỗi forgotPassword:', error);
        return {
            success: false,
            message: 'Lỗi khi gửi OTP reset mật khẩu',
            error: error.message,
        };
    }
};

/**
 * Reset mật khẩu
 * @param {string} email - Địa chỉ email
 * @param {string} otp - Mã OTP
 * @param {string} newPassword - Mật khẩu mới
 * @returns {Promise<{success: boolean, message: string}>}
 */
const resetPassword = async (email, otp, newPassword) => {
    try {
        // 1. Kiểm tra email tồn tại
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return {
                success: false,
                message: 'Email không tồn tại trong hệ thống',
            };
        }

        // 2. Kiểm tra OTP
        const emailVerification = await prisma.emailVerification.findFirst({
            where: { email },
            orderBy: { createdAt: 'desc' },
        });

        if (!emailVerification) {
            return {
                success: false,
                message: 'OTP không tồn tại, vui lòng yêu cầu OTP mới',
            };
        }

        if (emailVerification.otp !== otp) {
            return {
                success: false,
                message: 'OTP không chính xác',
            };
        }

        if (!isOtpValid(emailVerification.expiredAt)) {
            return {
                success: false,
                message: 'OTP đã hết hạn, vui lòng yêu cầu OTP mới',
            };
        }

        // 3. Hash password mới
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        // 4. Update password
        await prisma.user.update({
            where: { email },
            data: { passwordHash },
        });

        // 5. Xóa OTP khỏi database
        await prisma.emailVerification.deleteMany({
            where: { email },
        });

        return {
            success: true,
            message: 'Đặt lại mật khẩu thành công',
        };
    } catch (error) {
        console.error('❌ Lỗi resetPassword:', error);
        return {
            success: false,
            message: 'Lỗi khi đặt lại mật khẩu',
            error: error.message,
        };
    }
};

module.exports = {
    sendOtp,
    registerWithOtp,
    forgotPassword,
    resetPassword,
};
