const prisma = require('../src/config/prisma');

const buildWhereClause = ({ search, category, minPrice, maxPrice }) => {
    const conditions = [{ status: 'ACTIVE' }];

    if (search) {
        conditions.push({
            OR: [
                { name: { contains: search } },
                { slug: { contains: search } },
            ],
        });
    }

    if (category) {
        conditions.push({
            category: {
                slug: category,
            },
        });
    }

    if (minPrice || maxPrice) {
        const priceFilter = {};

        if (minPrice) {
            priceFilter.gte = Number(minPrice);
        }

        if (maxPrice) {
            priceFilter.lte = Number(maxPrice);
        }

        conditions.push({
            price: priceFilter,
        });
    }

    return {
        AND: conditions,
    };
};

const getOrderByClause = (sort) => {
    switch (sort) {
        case 'price_asc':
            return { price: 'asc' };
        case 'price_desc':
            return { price: 'desc' };
        case 'newest':
            return { createdAt: 'desc' };
        default:
            return { stockQuantity: 'desc' };
    }
};

const getStorefrontProducts = async (filters) => {
    const where = buildWhereClause(filters);

    const [products, categories] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy: getOrderByClause(filters.sort),
            include: {
                category: true,
                images: {
                    where: {
                        isPrimary: true,
                    },
                    take: 1,
                },
            },
        }),
        prisma.category.findMany({
            orderBy: {
                name: 'asc',
            },
            select: {
                id: true,
                name: true,
                slug: true,
            },
        }),
    ]);

    return {
        filters: {
            search: filters.search || '',
            category: filters.category || '',
            minPrice: filters.minPrice || '',
            maxPrice: filters.maxPrice || '',
            sort: filters.sort || 'featured',
        },
        categories,
        total: products.length,
        products: products.map((product) => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: Number(product.price || 0),
            stockQuantity: product.stockQuantity,
            warrantyMonths: product.warrantyMonths,
            categoryName: product.category?.name || 'Danh muc',
            categorySlug: product.category?.slug || '',
            description:
                product.specifications?.baseClock ||
                product.specifications?.socket ||
                `Bao hanh ${product.warrantyMonths} thang`,
            imageUrl:
                product.images[0]?.imageUrl ||
                'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
            rating: 4.8,
            featured: product.stockQuantity > 0,
        })),
    };
};

module.exports = {
    getStorefrontProducts,
};
