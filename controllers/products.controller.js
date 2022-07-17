const { Product, Category } = require('../models');
const { Op } = require("sequelize");

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

        //category filtering
        if (req.query.category) {
            const category = await Category.findOne({ where: { name: req.query.category } });
            options.where = { category_id: category.id };
        } else if (req.query.name) {
            options.where = { name: { [Op.iLike]: `%${req.query.name}%` } };
        }
        const data = await Product.findAll(options);
        if (data.length === 0) {
            throw new Error(`products not found`);
        }
        return res.status(200).json({
            status: 'success',
            data
        });
    } catch (err) {
        next(err);
    }
}

const getAllProductSeller = async (req, res, next) => {
    try {
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

        if (req.user.id != req.params.id) throw new Error('Unauthorized');
        options.where = { seller_id: req.params.id, isSold: req.query.isSold }
        const data = await Product.findAll(options);
        if (data.length === 0) {
            throw new Error(`products not found`);
        }
        return res.status(200).json({
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
        return res.status(200).json({
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
        //check user authorization
        if (req.user.id != seller_id) throw new Error('Unauthorized')
        const data = await Product.create({ seller_id, name, price, category_id, description, isSold, photos, isPublished });
        if (!data) {
            throw new Error('failed to create product');
        }
        return res.status(201).json({
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
        // check user id and seller id
        const product = await Product.findOne({ where: { id: req.params.id } });
        if (req.user.id != product.dataValues.seller_id) throw new Error('Unauthorized'); // if user id != seller id
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
        return res.status(200).json({
            status: 'success',
            data: data[1]
        })
    } catch (err) {
        next(err);
    }
}

const publishProduct = async (req, res, next) => {
    try {
        // check user id and seller id
        const product = await Product.findOne({ where: { id: req.params.id } });
        if (req.user.id != product.dataValues.seller_id) throw new Error('Unauthorized'); // if user id != seller id

        const data = await Product.update(
            { isPublished: true },
            {
                where: { id: req.params.id },
                plain: true,
                returning: true,
            }
        );
        if (!data) {
            throw new Error(`Failed to publish product`);
        }
        return res.status(200).json({
            status: 'success',
            message: 'successfully publish product'
        })
    } catch (err) {
        next(err);
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(id)
        await Product.destroy({ where: { id } });
        return res.status(200).json({
            status: 'success',
            message: `Product with id ${id} deleted successfully`
        })
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllProduct,
    getAllProductSeller,
    getProductById,
    createProduct,
    updateProduct,
    publishProduct,
    deleteProduct
}