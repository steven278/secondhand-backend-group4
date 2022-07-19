const router = require('express').Router();
const { getAllNotifications } = require('../controllers/notification.controller');
const passport = require('../helper/validation');

router.get('/', passport, getAllNotifications);

module.exports = router;