const { Product, Transaction } = require('../models');
const getAllSellerNotification = async (req, res, next) => {
    const { id } = req.user;
    let { page, row } = req.query;
    if (row == 0 || !page || !row) {
        page = 1;
        row = 5;
    }
    page -= page > 0 ? 1 : 0;
    page *= row;
    //query 
    const options = {
        order: [['updatedAt', 'ASC']],
        limit: row,
        offset: page,
        where: { isPublished: true, seller_id: id }
    }

    const products = await Product.findAll(options);
    const notifications = [];
    let ctr = 0;
    for (const product of products) {
        if (product.dataValues.isPublished) product.dataValues.message = 'Berhasil di terbitkan';
        product.dataValues.photos = product.dataValues.photos[0];
        notifications.push(product.dataValues);
        // const transactions = await Transaction.findAll({ where: { buyer_id: id, product_id: product.dataValues.id } });
        const transactions = await Transaction.findAll({ where: { product_id: product.dataValues.id } });
        for (const transaction of transactions) {
            //get product info
            const productInfo = await Product.findOne({ where: { id: transaction.dataValues.product_id } });
            transaction.dataValues.photos = productInfo.photos[0];
            transaction.dataValues.name = productInfo.name;
            transaction.dataValues.price = productInfo.price;
            transaction.dataValues.message = 'Penawaran Produk';
            notifications.push(transaction.dataValues);
        }
        ctr++;
    }
    notifications.sort((prev, next) => {
        return prev.createdAt - next.createdAt
    })

    //balikin juga id transaksi untuk di klik trx nya
    return res.status(200).json({
        status: 'success',
        data: notifications
    });
}

const getAllBuyerNotification = async (req, res, next) => {
    const { id } = req.user;
    let { page, row } = req.query;
    if (row == 0 || !page || !row) {
        page = 1;
        row = 5;
    }
    page -= page > 0 ? 1 : 0;
    page *= row;
    //query 
    const options = {
        order: [['updatedAt', 'ASC']],
        limit: row,
        offset: page,
        where: { buyer_id: id }
    }
    const transactions = await Transaction.findAll(options);
    for (const transaction of transactions) {
        const productInfo = await Product.findOne({ where: { id: transaction.dataValues.product_id } });
        transaction.dataValues.photos = productInfo.photos[0];
        transaction.dataValues.name = productInfo.name;
        transaction.dataValues.price = productInfo.price;
        transaction.dataValues.message = 'Pengajuan nego berhasil';
    }
    options.where.accepted = false;
    const failedTransactions = await Transaction.findAll(options);
    for (const transaction of failedTransactions) {
        const productInfo = await Product.findOne({ where: { id: transaction.dataValues.product_id } });
        transaction.dataValues.photos = productInfo.photos[0];
        transaction.dataValues.name = productInfo.name;
        transaction.dataValues.price = productInfo.price;
        transaction.dataValues.message = 'Nego yang kamu ajukan gagal';
    }
    options.where.accepted = true;
    const acceptedTransactions = await Transaction.findAll(options);
    for (const transaction of acceptedTransactions) {
        const productInfo = await Product.findOne({ where: { id: transaction.dataValues.product_id } });
        transaction.dataValues.photos = productInfo.photos[0];
        transaction.dataValues.name = productInfo.name;
        transaction.dataValues.price = productInfo.price;
        transaction.dataValues.message = 'Kamu akan segera dihubungi penjual via whatsapp';
    }
    options.where.price = { [Op.ne]: null };
    console.log(options.where)
    const soldTransaction = await Transaction.findAll(options);
    for (const transaction of failedTransactions) {
        const productInfo = await Product.findOne({ where: { id: transaction.dataValues.product_id } });
        transaction.dataValues.photos = productInfo.photos[0];
        transaction.dataValues.name = productInfo.name;
        transaction.dataValues.price = productInfo.price;
        transaction.dataValues.message = `Selamat, pembelian anda berhasil`;
    }
    const data = [...transactions, ...acceptedTransactions, ...failedTransactions, ...soldTransaction];

    return res.status(200).json({
        status: 'success',
        data
    });
}

module.exports = {
    getAllSellerNotification,
    getAllBuyerNotification
}
