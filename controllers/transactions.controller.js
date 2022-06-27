const { Transaction } = require('../models');

const getAllTransactions = async (req, res, next) => {
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
                'id', 'buyer_id', 'product_id', 'nego_price', 'price'
            ],
            order: [['id', 'ASC']],
            limit: row,
            offset: page
        }
        const data = await Transaction.findAll(options);
        if (data.length === 0) {
            throw new Error(`Transaction not found`);
        }
        res.status(200).json({
            status: 'success',
            data
        });
    } catch (err) {
        next(err);
    }
}

const getTransactionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const options = { where: { id } }
        const data = await Transaction.findOne(options);
        if (!data) {
            throw new Error(`failed to get Transaction by Id`);
        }
        res.status(200).json({
            status: 'success',
            data
        })
    } catch (err) {
        next(err);
    }
}

const createTransaction = async (req, res, next) => {
    try {
        const { buyer_id, product_id, nego_price, price } = req.body;
        const data = await Product.create({ buyer_id, product_id, nego_price, price });
        if (!data) {
            throw new Error('failed to create transaction');
        }
        res.status(200).json({
            message: 'Transaction created successfully',
            data
        })
    } catch (err) {
        next(err)
    }
}

const updateTransaction = async (req, res, next) => {
    try {
        const data = await Transaction.update(
            req.body,
            {
                where: { id: req.params.id },
                plain: true,
                returning: true,
            }
        );
        if (!data) {
            throw new Error(`Failed to update Transaction`);
        }
        res.status(200).json({
            status: 'success',
            data: data[1]
        })
    } catch (err) {
        next(err);
    }
}

const getInterestedTransaction = async (req, res, next) => {

}
module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction
}