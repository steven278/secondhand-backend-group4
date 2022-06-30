const express = require('express');
const router = express.Router();
const { loginUser, registUser } = require('../controllers/user.controller');

// login and register routes
router.post('/login', loginUser);
router.post('/regist', registUser);


// router.get('/:id', readUserDataById);
// router.post('/', userController.add)
// router.put('/:id', userController.update);


module.exports = router;