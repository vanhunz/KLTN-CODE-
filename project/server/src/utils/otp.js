/**
 * Tạo mã OTP 6 số ngẫu nhiên
 * @returns {string} OTP 6 số
 */
const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
};

/**
 * Tính thời gian hết hạn OTP (mặc định 5 phút)
 * @param {number} minutes - Số phút hết hạn
 * @returns {Date} Thời gian hết hạn
 */
const getOtpExpiryTime = (minutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5) => {
    const now = new Date();
    return new Date(now.getTime() + minutes * 60 * 1000);
};

/**
 * Kiểm tra OTP còn hiệu lực không
 * @param {Date} expiredAt - Thời gian hết hạn
 * @returns {boolean} True nếu còn hiệu lực
 */
const isOtpValid = (expiredAt) => {
    return new Date() < new Date(expiredAt);
};

module.exports = {
    generateOtp,
    getOtpExpiryTime,
    isOtpValid,
};
