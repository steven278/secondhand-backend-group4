const router = require('express').Router();
const { getAllInterest } = require('../controllers/interest.controller');
const passport = require('../helper/validation');

router.get('/', passport, getAllInterest);

module.exports = router;