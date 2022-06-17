const { Product } = require('../../models');

module.exports = async (req, res, next) => {
    try {
        const { seller_id, name, price, category_id, description, isSold, photos } = req.body;
        const data = await Product.create({ seller_id, name, price, category_id, description, isSold, photos });
        if (!data) {
            throw new Error('failed to create product');
        }
        res.status(200).json({
            message: 'Product created successfully',
            data
        })
    } catch (err) {
        next(err)
    }

}