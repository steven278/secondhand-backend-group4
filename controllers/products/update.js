const { Product } = require('../../models');

module.exports = async (req, res, next) => {
    // const { seller_id, name, price, category_id, description, photos, isSold } = req.body;
    // console.log(req.body)
    // const obj = { seller_id, name, price, category_id, description, photos, isSold }
    try {
        const data = await Product.update(
            req.body,
            {
                where: { id: req.params.id },
                plain: true,
                returning: true,
            }
        );
        if (!data) {
            throw new Error(`Failed to update product`);
        }
        res.status(200).json({
            status: 'success',
            data: data[1]
        })
    } catch (err) {
        next(err);
    }
}