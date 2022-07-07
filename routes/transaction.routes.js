const router = require('express').Router();
const upload = require('../helper/multer');
const { getAllTransactions, getTransactionById, createTransaction, updateTransaction } = require('../controllers/transactions.controller');
const { transactionValidation, transactionUpdateValidation, validate } = require('../validation/product.validator');
const passport = require('../helper/validation');

router.get('/', passport, getAllTransactions);
router.get('/:id', getTransactionById);
router.post('/', passport, transactionValidation(), validate, createTransaction);
router.put('/:id', passport, transactionUpdateValidation(), validate, updateTransaction);

module.exports = router;