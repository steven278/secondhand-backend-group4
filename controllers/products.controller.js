const { Product, Category } = require('../models');

const getAllProduct = async (req, res, next) => {
    try {
        //pagination
        let { page, row } = req.query;
        if (row == 0 || !page || !row) {
            page = 1;
            row = 5;
        }
        page -= page > 0 ? 1 : 0;
        page *= row;

        //query 
        const options = {
            attributes: [
                'id', 'seller_id', 'name', 'price', 'category_id', 'description', 'photos', 'isSold', 'isPublished'
            ],
            order: [['id', 'ASC']],
            limit: row,
            offset: page,
        }

        //get all sold transaction for a user
        if (req.query.seller_id && req.query.isSold) {
            options.where = { seller_id: req.query.seller_id, isSold: req.query.isSold };
        }

        //category filtering
        if (req.query.category) {
            const category = await Category.findOne({ where: { name: req.query.category } });
            options.where = { category_id: category.id };
        }
        const data = await Product.findAll(options);
        if (data.length === 0) {
            throw new Error(`products not found`);
        }
        res.status(200).json({
            status: 'success',
            data
        });
    } catch (err) {
        next(err);
    }
}

const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const options = { where: { id } }
        if (req.query.isSold) {
            options.where.isSold = req.query.isSold;
        }
        console.log(options);
        const data = await Product.findOne(options);
        if (!data) {
            throw new Error(`failed to get Product by Id`);
        }
        res.status(200).json({
            status: 'success',
            data
        })
    } catch (err) {
        next(err);
    }
}

const createProduct = async (req, res, next) => {
    try {
        const { seller_id, name, price, category_id, description, isSold, photos, isPublished } = req.body;
        const data = await Product.create({ seller_id, name, price, category_id, description, isSold, photos, isPublished });
        if (!data) {
            throw new Error('failed to create product');
        }
        res.status(200).json({
            message: 'Product created successfully',
            data
        })
    } catch (err) {
        next(err)
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const { name, price, category_id, description, isSold, photos, isPublished } = req.body;
        const obj = { name, price, category_id, description, isSold, photos, isPublished };
        const data = await Product.update(
            obj,
            {
                where: { id: req.params.id },
                plain: true,
                returning: true,
            }
        );
        if (!data) {
            throw new Error(`Failed to update product`);
        }
        res.status(200).json({
            status: 'success',
            data: data[1]
        })
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllProduct,
    getProductById,
    createProduct,
    updateProduct
}