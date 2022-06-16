const { profile } = require('../../models/profile');

module.exports = async (req, res) => {
    try {
        // Update User
        const updateProfile = await profile.update({
            photo: req.body.photo,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city
        }, {
            where: {
                id: req.params.id
            }
        })
        if (!updateProfile) {
            res.status(404).json({
                message: 'Failed to update data'
            })
        } else {
            res.status(200).json({
                message: 'Successfully updated data'
            })
        }
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}