const express = require('express');
const router = express.Router();
const { loginUser, registUser } = require('../controllers/user.controller');
const { validationUser, handleValidationErrors } = require('../helper/emailValidation');
// const cors = require('cors');

// const corsOptions = {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true,
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// login and register routes
router.post('/login', loginUser);
router.post('/regist', validationUser(), handleValidationErrors, registUser);


// router.get('/:id', readUserDataById);
// router.post('/', userController.add)
// router.put('/:id', userController.update);


module.exports = router;