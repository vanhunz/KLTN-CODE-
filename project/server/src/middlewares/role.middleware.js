const allowRoles = (...roles) => (req, res, next) => {
    const currentRole = req.user?.role;

    if (!currentRole || !roles.includes(currentRole)) {
        return res.status(403).json({
            success: false,
            message: 'Ban khong co quyen truy cap tai nguyen nay',
        });
    }

    return next();
};

module.exports = allowRoles;
