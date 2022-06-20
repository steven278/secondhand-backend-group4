const { User } = require('../models');

const readUserDataById = async (req, res, next) => {
    // get the user by id
    try {
        const userData = await User.findOne({
            where: {
                id: req.params.id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            },
        })
        if (!userData) {
            res.status(404).json({
                status: 'fail',
                message: 'There is no user with this id'
            })
        } else {
            res.status(200).json({
                status: 'success',
                data: userData
            })
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
}


module.exports = {
    readUserDataById
}