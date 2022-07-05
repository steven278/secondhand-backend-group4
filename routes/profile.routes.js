const express = require('express');
const router = express.Router();
const validation = require('../helper/validation')
const { readProfile, updateProfile } = require('../controllers/profile.controller');
const upload = require('../helper/multer');
const cloudinary = require('../helper/uploadService');

router.get('/:id', validation, readProfile);
router.put('/:id', validation, upload.single('photo'), cloudinary, updateProfile);

module.exports = router;