const router = require('express').Router();
const products = require('./product.routes');

router.get('/', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'hello world'
    })
})

router.use('/products', products);

module.exports = { router };