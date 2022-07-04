const router = require('express').Router();
const upload = require('../helper/multer');
const uploadWithCloudinary = require('../helper/cloudinary');
const { getAllProduct, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/products.controller');
const { productValidation, productUpdateValidation, validate } = require('../validation/product.validator');

router.get('/', getAllProduct);
router.get('/:id', getProductById);
router.post('/', upload.array('photos', 4), productValidation(), validate, uploadWithCloudinary, createProduct);
router.put('/:id', upload.array('photos', 4), productUpdateValidation(), validate, uploadWithCloudinary, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;