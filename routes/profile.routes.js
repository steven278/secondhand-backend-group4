const express = require('express');
const router = express.Router();
const validation = require('../helper/validation')
const { readProfile, addProfile, updateProfile } = require('../controllers/profile.controller');
const upload = require('../helper/multer');
const cloudinary = require('../helper/uploadService');

router.get('/:id', readProfile);
router.post('/', validation, upload.single('photo'), cloudinary, addProfile);
router.put('/:id', validation, upload.single('photo'), updateProfile);

module.exports = router;