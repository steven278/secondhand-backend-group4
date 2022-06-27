const { Transaction, Product } = require('../models');
const { Op } = require("sequelize");


const getAllTransactions = async (req, res, next) => {
    try {
        let { page, row, seller_id, isSold, trx_price } = req.query;
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

        //get diminati (under progress)
        if (seller_id && isSold && trx_price) {
            const attrOption = trx_price === 'null' ? { [Op.is]: null } : trx_price;
            const products = await Product.findAll({ where: { seller_id, isSold } });
            // console.log(products.length)
            const data = [];
            for (let i = 0; i <= products.length; i++) {
                // console.log(products[i].id)
                const transactions = await Transaction.findAll({ where: { price: attrOption, product_id: products[i].id } });
                // console.log(transactions)
                data.push(transactions);
                console.log(data)
            }
            console.log(data)
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

module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction
}