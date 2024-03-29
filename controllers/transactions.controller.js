const { Transaction, Product, User, Notification } = require('../models');
const { Op } = require("sequelize");

const getAllTransactions = async (req, res, next) => {
    try {
        let { page, row, buyer_id, product_id, isBuyer } = req.query;
        if (row == 0 || !page || !row) {
            page = 1;
            row = 5;
        }
        page -= page > 0 ? 1 : 0;
        page *= row;

        const options = {
            attributes: [
                'id', 'buyer_id', 'product_id', 'nego_price', 'price', 'createdAt', 'updatedAt', 'accepted'
            ],
            order: [['id', 'ASC']],
            limit: row,
            offset: page
        }
        let result = '';

        if (isBuyer) { // get button status (from buyer's side)
            options.limit = 1;
            options.order = [['createdAt', 'DESC']];
            options.where = { product_id, buyer_id: req.user.id }
            const transactions = await Transaction.findOne(options);
            if (transactions == null) {
                result = { buttonStatus: 0 }
            } else {
                const productTemp = transactions.dataValues
                if (productTemp.accepted == null || productTemp.accepted == true) { //atau dibuat message = 2 (kamu akan segera dihubungi penjual ??, ceritanya dh di terima cuma blm ubah status)
                    productTemp.message = 1; // "menunggu respon penjual"
                } else {
                    productTemp.message = 0; // "saya tertarik dan ingin nego"
                }
                result = { buttonStatus: productTemp.message };
            }
        }
        else if (buyer_id) { //get buyer's transactions
            //check user id and buyer id
            if (req.user.id != buyer_id) throw new Error('Unauthorized');
            options.where = { buyer_id };
            const transactions = await Transaction.findAll(options);
            for (let i = 0; i < transactions.length; i++) {
                const product = await Product.findOne({ where: { id: transactions[i].product_id } });
                if (product.isSold && transactions[i].price == null) { //cek apabila gagal ditawar
                    transactions[i].dataValues.status = 'gagal ditawar'
                } else if (product.isSold && transactions[i].price != null) { //cek apabila berhasil ditawar
                    transactions[i].dataValues.status = 'berhasil ditawar'
                } else if (product.isSold == false) { //cek apabila sedang ditawar
                    transactions[i].dataValues.status = 'sedang ditawar'
                }
            }
            result = transactions
        }
        else if (product_id) {
            const transactions = await Transaction.findAll({ where: { product_id } });
            result = transactions
        }
        else { //find all transactions
            const trx = await Transaction.findAll(options);
            result = trx;
        }
        return res.status(200).json({
            status: 'success',
            data: result
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
        //cek sudah terjual / belum ?
        const product = await Product.findOne({ where: { id: product_id } });
        if (product.dataValues.isSold == true) throw new Error('product has been sold');
        const data = await Transaction.create({ buyer_id, product_id, nego_price, price: null, accepted: null });
        await Notification.create({ product_id, transaction_id: data.dataValues.id, buyer_id, message: 'Penawaran Produk' });
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
            trx = await Transaction.update({ accepted: false }, options);
            if (!trx) throw new Error(`Failed to update Transaction`);
            await Notification.create({ product_id: prod.dataValues.id, transaction_id: req.params.id, buyer_id, message: 'Nego yang kamu ajukan gagal' });
        }
        else if (price > 0 && buyer_id) {
            trx = await Transaction.update({ accepted: true, price }, options);
            if (!trx) throw new Error(`Failed to update Transaction`);
            await Notification.create({ product_id: prod.dataValues.id, transaction_id: req.params.id, buyer_id, message: 'Selamat, pembelian anda berhasil' });
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
            trx = await Transaction.update({ accepted: true }, options);
            if (!trx) throw new Error(`Failed to update Transaction`);
            await Notification.create({ product_id: prod.dataValues.id, transaction_id: req.params.id, buyer_id, message: 'Kamu akan segera dihubungi penjual via whatsapp' });
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