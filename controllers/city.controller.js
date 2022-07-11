const { City } = require('../models');
const { Op } = require("sequelize");

const getAllCities = async (req, res, next) => {
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
                'id', 'name'
            ],
            order: [['id', 'ASC']],
            limit: row,
            offset: page,
            where: {
                name: { [Op.iLike]: `${req.query.city}%` }
            }
        }
        const data = await City.findAll(options);

        return res.status(200).json({
            status: 'success',
            data
        });
    } catch (err) {
        next(err)
    }

}

module.exports = {
    getAllCities
}