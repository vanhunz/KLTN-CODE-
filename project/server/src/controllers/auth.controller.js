const authService = require('../services/auth.service.js');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đủ email và mật khẩu',
            });
        }

        const result = await authService.login(email, password);

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            data: result,
        });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const { email, password, fullName, phone, address } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đủ họ tên, email và mật khẩu',
            });
        }

        const result = await authService.register({
            email,
            password,
            fullName,
            phone,
            address,
        });

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            data: result,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getDashboard = async (req, res) => {
    try {
        const data = await authService.getDashboardData();
        res.status(200).json({
            success: true,
            message: 'Lay du lieu dashboard thanh cong',
            data,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await authService.getCurrentUser(req.user.id);
        res.status(200).json({
            success: true,
            message: 'Lay thong tin nguoi dung thanh cong',
            data: { user },
        });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

module.exports = {
    loginUser,
    registerUser,
    getDashboard,
    getProfile,
};
