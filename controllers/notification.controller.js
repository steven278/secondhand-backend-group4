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
    // const productsTemp = [];
    // const transactionsTemp = [];
    let ctr = 0;
    for (const product of products) {
        if (product.dataValues.isPublished) product.dataValues.message = 'Berhasil di terbitkan';
        notifications.push(product.dataValues);
        const transactions = await Transaction.findAll({ where: { buyer_id: id, product_id: product.dataValues.id } });
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
    transactions.forEach(transaction => {
        transaction.dataValues.message = 'Pengajuan nego berhasil'
    })
    return res.status(200).json({
        status: 'success',
        data: transactions
    });
}

module.exports = {
    getAllSellerNotification,
    getAllBuyerNotification
}
