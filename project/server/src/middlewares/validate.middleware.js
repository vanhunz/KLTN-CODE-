const validate = (schema) => (req, res, next) => {
	try {
		const { data, errors } = schema(req.body);

		if (errors.length > 0) {
			return res.status(400).json({
				success: false,
				message: errors[0],
				errors,
			});
		}

		req.body = data;
		return next();
	} catch (error) {
		return res.status(400).json({
			success: false,
			message: error.message || 'Du lieu khong hop le',
		});
	}
};

module.exports = validate;
