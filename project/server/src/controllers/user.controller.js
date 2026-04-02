const userService = require('../services/user.service');

const getMyProfile = async (req, res) => {
	try {
		const data = await userService.getProfileById(req.user.id);
		res.status(200).json({
			success: true,
			message: 'Lay thong tin nguoi dung thanh cong',
			data,
		});
	} catch (error) {
		res.status(404).json({
			success: false,
			message: error.message,
		});
	}
};

const updateMyProfile = async (req, res) => {
	try {
		const data = await userService.updateProfile(req.user.id, req.body);
		res.status(200).json({
			success: true,
			message: 'Cap nhat thong tin thanh cong',
			data,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

const changeMyPassword = async (req, res) => {
	try {
		await userService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
		res.status(200).json({
			success: true,
			message: 'Doi mat khau thanh cong',
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

module.exports = {
	getMyProfile,
	updateMyProfile,
	changeMyPassword,
};
