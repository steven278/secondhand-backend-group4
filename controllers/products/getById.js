const { Product } = require('../../models');

module.exports = async (req, res, next) => {
    try {
        const { id } = req.params;
        const options = { where: { id } }
        const data = await Product.findOne(options);
        if (!data) {
            throw new Error(`failed to get Product by Id`);
        }
        res.status(200).json({
            status: 'success',
            data
        })
    } catch (err) {
        next(err);
    }
}