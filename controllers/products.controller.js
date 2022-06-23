const { Product } = require('../models');

const getAllProduct = async (req, res, next) => {
    try {
        let { page, row } = req.query;
        if (row == 0 || !page || !row) {
            page = 1;
            row = 5;
        }
        page -= page > 0 ? 1 : 0;
        page *= row;

        const options = {
            attributes: [
                'id', 'seller_id', 'name', 'price', 'category_id', 'description', 'photos', 'isSold', 'isPublished'
            ],
            order: [['id', 'ASC']],
            limit: row,
            offset: page
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