const cities = require('all-the-cities');


const getAllCities = (req, res, next) => {
    try {
        const options = {
            attributes: [
                'id', 'seller_id', 'name', 'price', 'category_id', 'description', 'photos', 'isSold', 'isPublished'
            ],
            order: [['id', 'ASC']],
            limit: row,
            offset: page,
        }
        const data = [];
        const getCities = cities.filter(city => city.name.match(`ban`));
        getCities.forEach(city => {
            if (city.country == 'ID') {
                // const cityName = city.name;

                data.push(city);
            }
        });

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