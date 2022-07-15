"use strict";
const { check, validationResult } = require('express-validator');

const validationUser = () => {
    return [
        check('name')
            .exists()
            .withMessage('username is required')
            .isLength({ min: 3 })
            .withMessage('wrong username length'),

        check('email')
            .exists()
            .withMessage('email is required')
            .isEmail()
            .withMessage('email is not a valid email'),
    ]
};

function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    next();
}

module.exports = {
    handleValidationErrors,
    validationUser
}