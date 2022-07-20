const { Transaction, Product, User } = require('../models');
const { Op } = require("sequelize");


const getAllTransactions = async (req, res, next) => {
    try {
        let { page, row, buyer_id, product_id, isSeller } = req.query;
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
        let message = '';

        if (isSeller) { // nanti
            options.where = { product_id };
            const transactions = await Transaction.findAll(options);
            transactions.forEach(transaction => {
                if (transaction.dataValues.price == null) {
                    data.push(transaction.dataValues);
                }
            })
        }
        else if (buyer_id) { //get buyer's transactions
            //check user id and buyer id
            if (req.user.id != buyer_id) throw new Error('Unauthorized');
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
        }
        else if (product_id) {
            // options.limit = 1;
            // options.order = [['createdAt', 'DESC']];
            const transactions = await Transaction.findAll({ where: { product_id } });
            data.push(transactions);
            // data.push(transactions.pop());
            // console.log(transactions.dataValues)
            // console.log(data)
            // data.push(transactions.dataValues)
            // const buyer = await User.findOne({ where: { id: req.user.id } });
            // data.push(buyer.dataValues);
            // const product = await Product.findOne({ where: { id: data[0].product_id } });
            // data.push(product.dataValues);
            // console.log(data);
            // // if (transactions.length < 1 || data.accepted == false) {

            // // } else if (data.accepted == true) {
            // //     // console.log('ffffffffffffffffffffffff')
            // // }
            // if (data[0].accepted == null) {
            //     data[0].message = 1; // menunggu respon penjual
            // } else {
            //     data[0].message = 0; //saya tertarik dan ingin nego
            // }
            return res.status(200).json({
                status: 'success',
                data
            });
        }
        // else if (seller_id && isSold && trx_price) { // get diminati 
        //     //check user id and seller id
        //     if (req.user.id != seller_id) throw new Error('Unauthorized');
        //     const attrOption = trx_price === 'null' ? { [Op.is]: null } : trx_price;
        //     const products = await Product.findAll({ where: { seller_id, isSold } });
        //     //find all transactions from all products
        //     for (const product of products) {
        //         options.where = { price: attrOption, product_id: product.id };
        //         options.attributes = ['buyer_id', 'product_id', 'nego_price', 'price'];
        //         const transactions = await Transaction.findAll(options);
        //         if (transactions.length > 0) data.push(transactions);
        //     }
        // }
        else { //find all transactions
            const trx = await Transaction.findAll(options);
            data.push(trx);
        }
        //if seller id || issold || trx_price g boleh tampilin semua

        if (data.length === 0) {
            throw new Error(`Transaction not found`);
        }
        return res.status(200).json({
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
        return res.status(200).json({
            status: 'success',
            data
        })
    } catch (err) {
        next(err);
    }
}

const createTransaction = async (req, res, next) => {
    try {
        let { buyer_id, product_id, nego_price, price } = req.body;
        //check user id and seller id
        if (req.user.id != buyer_id) throw new Error('Unauthorized');
        //cek sudah terjual / bleum ?
        const data = await Transaction.create({ buyer_id, product_id, nego_price, price: null, accepted: null });
        if (!data) {
            throw new Error('failed to create transaction');
        }
        return res.status(201).json({
            message: 'Transaction created successfully',
            data
        })
    } catch (err) {
        next(err)
    }
}

const updateTransaction = async (req, res, next) => {
    try {
        //check user id and seller id 
        const transaction = await Transaction.findOne({ where: { id: req.params.id } });
        const prod = await Product.findOne({ where: { id: transaction.dataValues.product_id } });
        if (req.user.id != prod.dataValues.seller_id) throw new Error('Unauthorized');

        const { price, accepted, buyer_id } = req.body;
        const options = {
            where: { id: req.params.id },
            plain: true,
            returning: true,
        }
        let trx;
        if (accepted === 'false') {
            console.log('tolak di awal')
            trx = await Transaction.update({ accepted: false }, options);
            if (!trx) throw new Error(`Failed to update Transaction`);
        }
        else if (accepted && price > 0 && buyer_id) {
            console.log('ubah jadi terjual')
            trx = await Transaction.update({ accepted: true, price }, options);
            console.log(buyer_id);
            if (!trx) throw new Error(`Failed to update Transaction`);
            const product = await Product.update(
                { isSold: true, buyer_id },
                {
                    where: { id: trx[1].dataValues.product_id },
                    plain: true,
                    returning: true,
                }
            );
            if (!product) {
                throw new Error(`Failed to update Transaction`);
            }
        }
        else if (accepted === 'true') {
            console.log('terima di awal')
            trx = await Transaction.update({ accepted: true }, options);
            if (!trx) throw new Error(`Failed to update Transaction`);
        }

        return res.status(200).json({
            status: 'success',
            data: trx[1].dataValues
        })
    } catch (err) {
        next(err);
    }
}


const deleteTransaction = async (req, res, next) => {
    try {
        const { id } = req.params;
        // console.log(id)
        await Transaction.destroy({ where: { id } });
        return res.status(200).json({
            status: 'success',
            message: `Trasnsaction with id ${id} deleted successfully`
        })
    } catch (err) {
        next(err);
    }
}
module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction
}