const router = require('express').Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'hello world'
    })
})

module.exports = { router };