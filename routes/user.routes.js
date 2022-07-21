const express = require('express');
const router = express.Router();
const { loginUser, registUser } = require('../controllers/user.controller');
const { validationUser, handleValidationErrors } = require('../helper/emailValidation');

// login and register routes
router.post('/login', loginUser);
router.post('/regist', validationUser(), handleValidationErrors, registUser);

module.exports = router;