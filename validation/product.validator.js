const { check, validationResult } = require('express-validator');

const productValidation = () => {
    return [
        check('user_id').isNumeric().withMessage('must be a number'),
        check('name').isLength({ min: 2 }).withMessage('must be at least 2 chars long'),
        check('price').isNumeric().withMessage('must be a number'),
        check('category_id').isNumeric().withMessage('must be a number'),
        check('description').isLength({ min: 10 }).withMessage('must be at least 10 chars long'),
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
    validate
};