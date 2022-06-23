const router = require('express').Router();
const products = require('./product.routes');
const transactions = require('./transaction.routes');

router.get('/', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'hello world'
    })
})

router.use('/products', products);
router.use('/transactions', transactions);

router.use((err, req, res, next) => {
    if (err.name === 'SequelizeDatabaseError' || err.name === 'SequelizeUniqueConstraintError' || err.name === 'ReferenceError' || err.name === 'SequelizeForeignKeyConstraintError') {
        res.status(400).json({
            status: 'Bad Request',
            errorName: err.name,
            message: err.message
        });
    } else if (err.name === 'Error' || err.name === 'TypeError') {
        res.status(404).json({
            status: 'Not Found',
            errorName: err.name,
            message: err.message
        });
    }
    res.status(500).json({
        status: 'Internal Server Error',
        errorName: err.name,
        message: err.message
    });
})

module.exports = { router };