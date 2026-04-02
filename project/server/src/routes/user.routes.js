const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const userController = require('../controllers/user.controller');
const {
	validateUpdateProfile,
	validateChangePassword,
} = require('../validations/user.schema');

const router = express.Router();

router.get('/me', authMiddleware, userController.getMyProfile);
router.put('/me', authMiddleware, validate(validateUpdateProfile), userController.updateMyProfile);
router.put('/me/password', authMiddleware, validate(validateChangePassword), userController.changeMyPassword);

module.exports = router;
