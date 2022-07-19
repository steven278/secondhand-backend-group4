const { Product, Transaction } = require('../models');
const getAllNotifications = async (req, res, next) => {
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
    // options.where = { buyer_id: id };
    products.forEach(async (product) => {
        notifications.push(product);
        const trx = await Transaction.findAll({ where: { buyer_id: id, product_id: product.dataValues.id } });
        notifications.push(trx);
    });
    //pisah notif buyer dan seller
    // console.log(products[0].dataValues)

    //balikin juga id transaksi untuk di klik trx nya
    return res.status(200).json({
        status: 'success',
        data: notifications
    });
}

module.exports = {
    getAllNotifications
}
