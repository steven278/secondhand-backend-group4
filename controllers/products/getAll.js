const { Product } = require('../../models');

module.exports = async (req, res, next) => {
    try {
        let { page, row } = req.query;
        if (row == 0 || !page || !row) {
            page = 1;
            row = 5;
        }
        page -= page > 0 ? 1 : 0;
        page *= row;

        const options = {
            attributes: [
                'seller_id', 'name', 'price', 'category_id', 'description', 'photos', 'isSold'
            ],
            order: [['id', 'ASC']],
            limit: row,
            offset: page
        }
        const data = await Product.findAll(options);
        if (data.length === 0) {
            throw new Error(`products not found`);
        }
        res.status(200).json({
            status: 'success',
            data
        });
    } catch (err) {
        next(err);
    }
}