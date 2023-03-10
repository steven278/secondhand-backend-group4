const express = require('express');
const router = express.Router();
const validation = require('../helper/validation')
const { readProfile, updateProfile } = require('../controllers/profile.controller');
const { upload, uploadProfile } = require('../helper/multer');
const cloudinary = require('../helper/uploadService');

router.get('/auth/:id', validation, readProfile);
router.get('/:id', readProfile);
router.put('/:id', validation, uploadProfile.single('photo'), cloudinary, updateProfile);

module.exports = router;