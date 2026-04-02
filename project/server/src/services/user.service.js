const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { signAccessToken } = require('../utils/token');

const sanitizeUser = (user) => {
    const { passwordHash, ...userInfo } = user;
    return userInfo;
};

const getProfileById = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: { role: true },
    });

    if (!user) {
        throw new Error('Nguoi dung khong ton tai');
    }

    return { user: sanitizeUser(user) };
};

const updateProfile = async (userId, payload) => {
    const currentUser = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: { role: true },
    });

    if (!currentUser) {
        throw new Error('Nguoi dung khong ton tai');
    }

    if (payload.email && payload.email !== currentUser.email) {
        const emailTaken = await prisma.user.findFirst({
            where: {
                email: payload.email,
                NOT: { id: Number(userId) },
            },
        });

        if (emailTaken) {
            throw new Error('Email da duoc su dung');
        }
    }

    const updatedUser = await prisma.user.update({
        where: { id: Number(userId) },
        data: {
            fullName: payload.fullName,
            email: payload.email,
            phone: payload.phone || null,
            address: payload.address || null,
        },
        include: { role: true },
    });

    const token = signAccessToken({
        id: updatedUser.id,
        role: updatedUser.role?.name || null,
        email: updatedUser.email,
    });

    return {
        user: sanitizeUser(updatedUser),
        token,
    };
};

const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
    });

    if (!user) {
        throw new Error('Nguoi dung khong ton tai');
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    const isLegacyPasswordValid = currentPassword === user.passwordHash;

    if (!isPasswordValid && !isLegacyPasswordValid) {
        throw new Error('Mat khau hien tai khong chinh xac');
    }

    const isSameAsCurrent = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSameAsCurrent || newPassword === currentPassword) {
        throw new Error('Mat khau moi khong duoc trung mat khau hien tai');
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { id: Number(userId) },
        data: { passwordHash: newHash },
    });
};

module.exports = {
    getProfileById,
    updateProfile,
    changePassword,
};