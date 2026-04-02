const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { signAccessToken } = require('../utils/token');

const sanitizeUser = (user) => {
    const { passwordHash, ...userInfo } = user;
    return userInfo;
};

const createToken = (user) =>
    signAccessToken(
        { id: user.id, role: user.role?.name || null, email: user.email },
    );

const login = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true },
    });

    if (!user) {
        throw new Error('Email không tồn tại trong hệ thống');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    const isLegacyPasswordValid = password === user.passwordHash;

    if (!isPasswordValid && !isLegacyPasswordValid) {
        throw new Error('Mật khẩu không chính xác');
    }

    if (isLegacyPasswordValid && !isPasswordValid) {
        const newHash = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: newHash },
        });
        user.passwordHash = newHash;
    }

    return {
        user: sanitizeUser(user),
        token: createToken(user),
    };
};

const register = async ({ email, password, fullName, phone, address }) => {
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error('Email đã được sử dụng');
    }

    const customerRole = await prisma.role.upsert({
        where: { name: 'CUSTOMER' },
        update: {},
        create: {
            name: 'CUSTOMER',
            description: 'Khách hàng tiêu chuẩn',
        },
    });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            fullName,
            phone: phone || null,
            address: address || null,
            roleId: customerRole.id,
        },
        include: { role: true },
    });

    return {
        user: sanitizeUser(user),
        token: createToken(user),
    };
};

const getDashboardData = async () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
        totalUsers,
        totalAdmins,
        totalCustomers,
        totalProducts,
        totalOrders,
        monthlyOrders,
        previousMonthlyOrders,
        lowStockProducts,
        recentOrders,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
            where: {
                role: {
                    name: 'ADMIN',
                },
            },
        }),
        prisma.user.count({
            where: {
                role: {
                    name: 'CUSTOMER',
                },
            },
        }),
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.findMany({
            where: {
                createdAt: {
                    gte: monthStart,
                },
            },
            select: {
                totalAmount: true,
            },
        }),
        prisma.order.findMany({
            where: {
                createdAt: {
                    gte: previousMonthStart,
                    lt: monthStart,
                },
            },
            select: {
                totalAmount: true,
            },
        }),
        prisma.product.findMany({
            where: {
                stockQuantity: {
                    lte: 5,
                },
            },
            orderBy: {
                stockQuantity: 'asc',
            },
            take: 5,
            select: {
                id: true,
                name: true,
                stockQuantity: true,
                price: true,
                updatedAt: true,
            },
        }),
        prisma.order.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
            include: {
                user: {
                    select: {
                        fullName: true,
                        email: true,
                    },
                },
                orderItems: {
                    take: 1,
                    include: {
                        product: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        }),
    ]);

    const monthlyRevenue = monthlyOrders.reduce(
        (sum, order) => sum + Number(order.totalAmount || 0),
        0,
    );
    const previousMonthlyRevenue = previousMonthlyOrders.reduce(
        (sum, order) => sum + Number(order.totalAmount || 0),
        0,
    );

    const revenueGrowth = previousMonthlyRevenue === 0
        ? monthlyRevenue > 0 ? 100 : 0
        : ((monthlyRevenue - previousMonthlyRevenue) / previousMonthlyRevenue) * 100;

    return {
        overview: {
            monthlyRevenue,
            revenueGrowth,
            activeOrders: totalOrders,
            inventoryItems: totalProducts,
            totalUsers,
            totalAdmins,
            totalCustomers,
            lowStockCount: lowStockProducts.length,
        },
        recentOrders: recentOrders.map((order) => ({
            id: order.id,
            code: `#SC-${String(order.id).padStart(4, '0')}`,
            configuration: order.orderItems[0]?.product?.name || 'Chua co san pham',
            client: order.user?.fullName || order.user?.email || 'Khach hang',
            amount: Number(order.totalAmount || 0),
            status: order.orderStatus,
            createdAt: order.createdAt,
        })),
        lowStockProducts: lowStockProducts.map((product) => ({
            id: product.id,
            name: product.name,
            stockQuantity: product.stockQuantity,
            price: Number(product.price || 0),
            updatedAt: product.updatedAt,
        })),
    };
};

const getCurrentUser = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        include: { role: true },
    });

    if (!user) {
        throw new Error('Nguoi dung khong ton tai');
    }

    return sanitizeUser(user);
};

module.exports = {
    login,
    register,
    getDashboardData,
    getCurrentUser,
};
