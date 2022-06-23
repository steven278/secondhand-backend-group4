const router = require('express').Router();
const upload = require('../helper/multer');
const { getAllTransactions, getTransactionById, createTransaction, updateTransaction } = require('../controllers/transactions.controller');
const { transactionValidation, transactionUpdateValidation, validate } = require('../validation/product.validator');

router.get('/', getAllTransactions);
router.get('/:id', getTransactionById);
router.post('/', transactionValidation(), validate, createTransaction);
router.put('/:id', transactionUpdateValidation(), validate, updateTransaction);

module.exports = router;