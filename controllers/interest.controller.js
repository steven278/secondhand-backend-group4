const { Product, Transaction } = require('../models');

const getAllInterest = async (req, res, next) => {
    try {
        let { page, row, seller_id } = req.query;
        if (row == 0 || !page || !row) {
            page = 1;
            row = 5;
        }
        page -= page > 0 ? 1 : 0;
        page *= row;

        const options = {
            attributes: [
                'id', 'buyer_id', 'product_id', 'nego_price', 'price', 'createdAt', 'updatedAt'
            ],
            order: [['id', 'ASC']],
            limit: row,
            offset: page
        }
        //check user id and seller id
        if (req.user.id != seller_id) throw new Error('Unauthorized');
        const data = [];
        const products = await Product.findAll({ where: { seller_id, isSold: false } });
        //find all transactions from all products
        for (const product of products) {
            options.where = { product_id: product.id };
            const transactions = await Transaction.findAll(options);
            if (transactions.length > 0) data.push(product);
        }
        return res.status(200).json({
            status: 'success',
            data
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllInterest }