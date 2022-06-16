const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileUser')

router.get('/:id', profileController.read);
router.post('/', profileController.add)
router.put('/:id', profileController.update);


module.exports = router;