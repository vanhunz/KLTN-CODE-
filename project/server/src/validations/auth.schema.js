const emailPattern = /^\S+@\S+\.\S+$/;

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const validateLogin = (body = {}) => {
	const errors = [];
	const data = {
		email: normalizeEmail(body.email),
		password: typeof body.password === 'string' ? body.password : '',
	};

	if (!data.email) {
		errors.push('Vui long nhap email');
	} else if (!emailPattern.test(data.email)) {
		errors.push('Email khong hop le');
	}

	if (!isNonEmptyString(data.password)) {
		errors.push('Vui long nhap mat khau');
	}

	return { data, errors };
};

const validateRegister = (body = {}) => {
	const errors = [];
	const data = {
		fullName: typeof body.fullName === 'string' ? body.fullName.trim() : '',
		email: normalizeEmail(body.email),
		phone: typeof body.phone === 'string' ? body.phone.trim() : '',
		address: typeof body.address === 'string' ? body.address.trim() : '',
		password: typeof body.password === 'string' ? body.password : '',
	};

	if (!isNonEmptyString(data.fullName)) {
		errors.push('Vui long nhap ho ten');
	}

	if (!data.email) {
		errors.push('Vui long nhap email');
	} else if (!emailPattern.test(data.email)) {
		errors.push('Email khong hop le');
	}

	if (!isNonEmptyString(data.password)) {
		errors.push('Vui long nhap mat khau');
	} else if (data.password.length < 6) {
		errors.push('Mat khau phai co it nhat 6 ky tu');
	}

	if (data.phone && !/^\d{8,15}$/.test(data.phone)) {
		errors.push('So dien thoai khong hop le');
	}

	return { data, errors };
};

module.exports = {
	validateLogin,
	validateRegister,
};
