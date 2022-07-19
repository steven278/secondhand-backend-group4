const { check, validationResult } = require('express-validator');

const productValidation = () => {
    return [
        check('seller_id').isNumeric().withMessage('must be a number'),
        check('name').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
        check('price').isNumeric().withMessage('must be a number'),
        check('category_id').isNumeric().withMessage('must be a number'),
        check('description').isLength({ min: 10 }).withMessage('must be at least 10 chars long'),
        check('isSold').isBoolean({ loose: true }).withMessage('must be a booelan'),
        check('isPublished').isBoolean({ loose: true }).withMessage('must be a booelan'),
    ]
}

const productUpdateValidation = () => {
    return [
        check('name').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
        check('price').isNumeric().withMessage('must be a number'),
        check('category_id').isNumeric().withMessage('must be a number'),
        check('description').isLength({ min: 10 }).withMessage('must be at least 10 chars long'),
        check('isSold').isBoolean({ loose: true }).withMessage('must be a booelan'),
        check('isPublished').isBoolean({ loose: true }).withMessage('must be a booelan'),
    ]
}

const transactionValidation = () => {
    return [
        check('buyer_id').isNumeric().withMessage('must be a number'),
        check('product_id').isNumeric().withMessage('must be a number'),
        check('nego_price').isNumeric().withMessage('must be a number'),
        check('price').isEmpty().withMessage('must be empty'),
    ]
}

const transactionUpdateValidation = () => {
    return [
        check('price').optional().isNumeric().withMessage('must be a number'),
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(400).json({
        errors: errors.array()
    });
}

module.exports = {
    productValidation,
    productUpdateValidation,
    transactionValidation,
    transactionUpdateValidation,
    validate
};