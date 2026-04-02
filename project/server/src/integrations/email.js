const nodemailer = require('nodemailer');

/**
 * Cấu hình transporter email
 * Sử dụng Gmail SMTP
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});

/**
 * Gửi email OTP
 * @param {string} email - Địa chỉ email người nhận
 * @param {string} otp - Mã OTP
 * @param {string} type - Loại OTP: 'register' hoặc 'reset-password'
 * @returns {Promise<boolean>}
 */
const sendOtpEmail = async (email, otp, type = 'register') => {
    try {
        let subject = '';
        let htmlContent = '';

        if (type === 'register') {
            subject = '🔐 Mã xác thực đăng ký - Silicon Curator';
            htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                    <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; text-align: center; margin-top: 0;">Xác thực đăng ký tài khoản</h2>
                        <p style="color: #666; font-size: 16px;">Xin chào,</p>
                        <p style="color: #666; font-size: 16px;">Cảm ơn bạn đã đăng ký tài khoản tại <strong>Silicon Curator</strong>.</p>
                        <p style="color: #666; font-size: 16px;">Mã xác thực của bạn là:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="font-size: 36px; font-weight: bold; color: #007bff; letter-spacing: 5px; background-color: #f0f0f0; padding: 15px; border-radius: 8px;">
                                ${otp}
                            </div>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            <strong>Lưu ý:</strong> Mã này sẽ hết hạn sau 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.
                        </p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
                            Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này. Tài khoản của bạn sẽ ở trạng thái chưa xác thực.
                        </p>
                    </div>
                </div>
            `;
        } else if (type === 'reset-password') {
            subject = '🔐 Mã reset mật khẩu - Silicon Curator';
            htmlContent = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                    <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; text-align: center; margin-top: 0;">Reset mật khẩu tài khoản</h2>
                        <p style="color: #666; font-size: 16px;">Xin chào,</p>
                        <p style="color: #666; font-size: 16px;">Chúng tôi nhận được yêu cầu reset mật khẩu cho tài khoản của bạn.</p>
                        <p style="color: #666; font-size: 16px;">Mã xác thực của bạn là:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="font-size: 36px; font-weight: bold; color: #007bff; letter-spacing: 5px; background-color: #f0f0f0; padding: 15px; border-radius: 8px;">
                                ${otp}
                            </div>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            <strong>Lưu ý:</strong> Mã này sẽ hết hạn sau 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai.
                        </p>
                        <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
                            Nếu bạn không yêu cầu reset mật khẩu, vui lòng bỏ qua email này. Mật khẩu của bạn sẽ không bị thay đổi.
                        </p>
                    </div>
                </div>
            `;
        }

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('❌ Lỗi gửi email:', error);
        return false;
    }
};

/**
 * Kiểm tra kết nối email
 */
const verifyEmailConnection = async () => {
    try {
        await transporter.verify();
        console.log('✅ Email service ready to send messages');
        return true;
    } catch (error) {
        console.error('❌ Email service error:', error);
        return false;
    }
};

module.exports = {
    transporter,
    sendOtpEmail,
    verifyEmailConnection,
};
