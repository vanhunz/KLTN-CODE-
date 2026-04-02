const productService = require('../../services/product.service');

const getStorefrontProducts = async (req, res) => {
    try {
        const result = await productService.getStorefrontProducts(req.query);

        return res.status(200).json({
            success: true,
            message: 'Lay danh sach san pham thanh cong',
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getStorefrontProducts,
};
