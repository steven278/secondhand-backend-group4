const express = require('express');
const router = express.Router();
const userController = require('../controllers/user')

// login and register routes
router.post('/login', userController.login);
router.post('/register', userController.register);


router.get('/:id', userController.read);
router.post('/', userController.add)
router.put('/:id', userController.update);


module.exports = router;