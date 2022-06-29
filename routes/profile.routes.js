const express = require('express');
const router = express.Router();
const { addProfile, readProfile, updateProfile } = require('../controllers/profile.controller');
const upload = require('../helper/multer');

router.get('/:id', readProfile);
router.post('/', upload.single('photo'), addProfile)
router.put('/:id', upload.single('photo'), updateProfile)

module.exports = router;