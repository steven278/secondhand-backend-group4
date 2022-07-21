const router = require('express').Router();
const { getAllSellerNotification, getAllBuyerNotification } = require('../controllers/notification.controller');
const passport = require('../helper/validation');

router.get('/seller', passport, getAllSellerNotification);
router.get('/buyer', passport, getAllBuyerNotification);

module.exports = router;