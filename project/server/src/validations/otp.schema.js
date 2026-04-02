/**
 * Validation schemas cho OTP authentication
 */

const sendOtpSchema = {
    email: {
        required: true,
        type: 'string',
        pattern: /.+@.+\..+/,
        errorMessage: 'Email không hợp lệ',
    },
};

const registerWithOtpSchema = {
    email: {
        required: true,
        type: 'string',
        pattern: /.+@.+\..+/,
        errorMessage: 'Email không hợp lệ',
    },
    password: {
        required: true,
        type: 'string',
        minLength: 6,
        errorMessage: 'Password phải có ít nhất 6 ký tự',
    },
    otp: {
        required: true,
        type: 'string',
        pattern: /^\d{6}$/,
        errorMessage: 'OTP phải là 6 số',
    },
    fullName: {
        required: true,
        type: 'string',
        minLength: 2,
        errorMessage: 'Họ tên phải có ít nhất 2 ký tự',
    },
    phone: {
        required: true,
        type: 'string',
        minLength: 10,
        errorMessage: 'Số điện thoại không hợp lệ',
    },
    address: {
        required: true,
        type: 'string',
        minLength: 5,
        errorMessage: 'Địa chỉ phải có ít nhất 5 ký tự',
    },
};

const forgotPasswordSchema = {
    email: {
        required: true,
        type: 'string',
        pattern: /.+@.+\..+/,
        errorMessage: 'Email không hợp lệ',
    },
};

const resetPasswordSchema = {
    email: {
        required: true,
        type: 'string',
        pattern: /.+@.+\..+/,
        errorMessage: 'Email không hợp lệ',
    },
    otp: {
        required: true,
        type: 'string',
        pattern: /^\d{6}$/,
        errorMessage: 'OTP phải là 6 số',
    },
    newPassword: {
        required: true,
        type: 'string',
        minLength: 6,
        errorMessage: 'Password mới phải có ít nhất 6 ký tự',
    },
};

/**
 * Validate field theo schema
 * @param {object} data - Dữ liệu cần validate
 * @param {object} schema - Schema validation
 * @returns {object} {valid: boolean, errors: object}
 */
const validateData = (data, schema) => {
    const errors = {};

    for (const field in schema) {
        const rules = schema[field];
        const value = data[field];

        // Kiểm tra required
        if (rules.required && (!value || value.trim() === '')) {
            errors[field] = `${field} là bắt buộc`;
            continue;
        }

        if (!value) continue;

        // Kiểm tra type
        if (rules.type && typeof value !== rules.type) {
            errors[field] = `${field} phải là ${rules.type}`;
            continue;
        }

        // Kiểm tra minLength
        if (rules.minLength && value.length < rules.minLength) {
            errors[field] = rules.errorMessage || `${field} quá ngắn`;
            continue;
        }

        // Kiểm tra pattern (regex)
        if (rules.pattern && !rules.pattern.test(value)) {
            errors[field] = rules.errorMessage || `${field} không hợp lệ`;
            continue;
        }
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

module.exports = {
    sendOtpSchema,
    registerWithOtpSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    validateData,
};
