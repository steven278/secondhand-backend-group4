const express = require('express');
const router = express.Router();
const profileRoutes = require('./profileRoutes');

router.use('/profile-user', profileRoutes);

module.exports = router;