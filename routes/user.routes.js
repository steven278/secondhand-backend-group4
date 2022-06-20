const express = require('express');
const router = express.Router();
const { readUserDataById } = require('../controllers/user.controller');

// login and register routes
// router.post('/login', userController.login);
// router.post('/register', userController.register);


router.get('/:id', readUserDataById);
// router.post('/', userController.add)
// router.put('/:id', userController.update);


module.exports = router;