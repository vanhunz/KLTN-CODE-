const emailPattern = /^\S+@\S+\.\S+$/;

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const validateUpdateProfile = (body = {}) => {
    const errors = [];
    const data = {
        fullName: typeof body.fullName === 'string' ? body.fullName.trim() : '',
        email: normalizeEmail(body.email),
        phone: typeof body.phone === 'string' ? body.phone.trim() : '',
        address: typeof body.address === 'string' ? body.address.trim() : '',
    };

    if (!data.fullName) {
        errors.push('Vui long nhap ho ten');
    }

    if (!data.email) {
        errors.push('Vui long nhap email');
    } else if (!emailPattern.test(data.email)) {
        errors.push('Email khong hop le');
    }

    if (data.phone && !/^\d{8,15}$/.test(data.phone)) {
        errors.push('So dien thoai khong hop le');
    }

    return { data, errors };
};

const validateChangePassword = (body = {}) => {
    const errors = [];
    const data = {
        currentPassword: typeof body.currentPassword === 'string' ? body.currentPassword : '',
        newPassword: typeof body.newPassword === 'string' ? body.newPassword : '',
    };

    if (!data.currentPassword) {
        errors.push('Vui long nhap mat khau hien tai');
    }

    if (!data.newPassword) {
        errors.push('Vui long nhap mat khau moi');
    } else if (data.newPassword.length < 6) {
        errors.push('Mat khau moi phai co it nhat 6 ky tu');
    }

    return { data, errors };
};

module.exports = {
    validateUpdateProfile,
    validateChangePassword,
};