const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['warn', 'error'], // Chỉ in ra lỗi, ẩn các câu query cho đỡ rối terminal
});

module.exports = prisma;