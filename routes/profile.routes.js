const express = require('express');
const router = express.Router();
const { addProfile, readProfile } = require('../controllers/profile.controller')

router.get('/:id', readProfile);
router.post('/', addProfile)
// router.put('/:id', profileController.update);


module.exports = router;