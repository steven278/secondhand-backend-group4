const router = require('express').Router();
const upload = require('../helper/multer');
const uploadWithCloudinary = require('../helper/cloudinary');
const getAll = require('../controllers/products/getAll');
const getById = require('../controllers/products/getById');
const create = require('../controllers/products/create');
const update = require('../controllers/products/update');
const { productValidation, validate } = require('../validation/product.validator');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', upload.array('photos', 4), productValidation(), validate, uploadWithCloudinary, create);
router.put('/', update);

module.exports = router;