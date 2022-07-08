const express = require('express');
const router = express.Router();
const { getAllCities } = require('../controllers/city.controller');

router.get('/', getAllCities);

module.exports = router;