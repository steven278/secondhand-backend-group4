const express = require('express');
const router = express.Router();
const userController = require('../controllers/user')

// login and register routes
router.post('/login', userController.login);
router.post('/register', userController.register);


router.get('/:id', profileController.read);
router.post('/', profileController.add)
router.put('/:id', profileController.update);


module.exports = router;