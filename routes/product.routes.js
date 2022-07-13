const router = require('express').Router();
const { upload, uploadProfile } = require('../helper/multer');
const uploadWithCloudinary = require('../helper/cloudinary');
const { getAllProduct, getAllProductSeller, getProductById, createProduct, updateProduct, publishProduct, deleteProduct } = require('../controllers/products.controller');
const { productValidation, productUpdateValidation, validate } = require('../validation/product.validator');
const passport = require('../helper/validation');

router.get('/', getAllProduct);
router.get('/seller/:id', passport, getAllProductSeller);
router.get('/:id', getProductById);
router.post('/', passport, upload.array('photos', 4), productValidation(), validate, uploadWithCloudinary, createProduct);
router.put('/publishProduct/:id', passport, publishProduct);
router.put('/:id', passport, upload.array('photos', 4), productUpdateValidation(), validate, uploadWithCloudinary, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;