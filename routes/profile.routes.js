const express = require('express');
const router = express.Router();
const { readProfile, updateProfile } = require('../controllers/profile.controller');
const upload = require('../helper/multer');

router.get('/:id', readProfile);
router.put('/:id', upload.single('photo'), updateProfile);

module.exports = router;