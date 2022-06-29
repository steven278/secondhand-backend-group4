const { Transaction, Product } = require('../models');
const { Op } = require("sequelize");


const getAllTransactions = async (req, res, next) => {
    try {
        let { page, row, seller_id, isSold, trx_price, buyer_id } = req.query;
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

        const data = [];
        if (buyer_id) { //get buyer's transactions
            options.where = { buyer_id };
            const transactions = await Transaction.findAll(options);
            for (let i = 0; i < transactions.length; i++) {
                const product = await Product.findOne({ where: { id: transactions[i].product_id } });
                if (product.isSold && transactions[i].price == null) {
                    transactions[i].dataValues.status = 'gagal ditawar'
                } else if (product.isSold && transactions[i].price != null) {
                    transactions[i].dataValues.status = 'berhasil ditawar'
                } else if (product.isSold == false) {
                    transactions[i].dataValues.status = 'sedang ditawar'
                }
            }
            data.push(transactions);
        } else if (seller_id && isSold && trx_price) { // get diminati 
            const attrOption = trx_price === 'null' ? { [Op.is]: null } : trx_price;
            const products = await Product.findAll({ where: { seller_id, isSold } });
            //find all transactions from all products
            for (const product of products) {
                options.where = { price: attrOption, product_id: product.id };
                options.attributes = ['buyer_id', 'product_id', 'nego_price', 'price'];
                const transactions = await Transaction.findAll(options);
                data.push(transactions);
            }
        } else { //find all transactions
            const trx = await Transaction.findAll(options);
            data.push(trx);
        }
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
        const trx = await Transaction.update(
            req.body,
            {
                where: { id: req.params.id },
                plain: true,
                returning: true,
            }
        );
        const product = await Product.update(
            { isSold: true },
            {
                where: { id: trx.product_id },
                plain: true,
                returning: true,
            }
        );
        if (!trx || !product) {
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

module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction
}