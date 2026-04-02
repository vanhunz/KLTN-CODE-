const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const allowRoles = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { validateLogin, validateRegister } = require('../validations/auth.schema');

const router = express.Router();

router.post('/register', validate(validateRegister), authController.registerUser);
router.post('/login', validate(validateLogin), authController.loginUser);
router.get('/me', authMiddleware, authController.getProfile);
router.get('/dashboard', authMiddleware, allowRoles('ADMIN'), authController.getDashboard);

module.exports = router;
