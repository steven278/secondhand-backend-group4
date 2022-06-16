const { profile } = require('../../models/profile');

module.exports = async (req, res) => {
    // add the profile user
    try {
        const addProfile = await profile.create({
            photo: req.body.photo,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city
        })
        if (!addProfile) {
            res.status(404).json({
                status: 'fail',
                message: 'Failed to add data'
            })
        } else {
            res.status(200).json({
                data: addProfile
            })
        }
    } catch (err) {

    }
}