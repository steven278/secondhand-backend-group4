const { Profile, User } = require('../models');

const readProfile = async (req, res) => {
    // get the profile user
    try {
        const profileUser = await Profile.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'photo', 'phone', 'address', 'city'],
            include: [
                {
                    model: User,
                    attributes: ['name']
                }
            ]
        });
        if (!profileUser) {
            return res.status(404).json({
                status: 'fail',
                message: 'Failed to get data'
            })
        } else {
            return res.status(200).json({
                status: 'success',
                data: profileUser
            })
        }
    } catch (err) {
        console.log(err)
        next(err);
    }
}

const updateProfile = async (req, res, next) => {
    try {
        const updateProfile = await Profile.update({
            photo: req.body.photo,
            address: req.body.address,
            city: req.body.city,
            phone: req.body.phone,
            updatedAt: new Date()
        }, { where: { id: req.params.id } })

        if (updateProfile) {
            await User.update({
                name: req.body.name,
                isVerified: true,
                updatedAt: new Date()
            }, { where: { id: req.params.id } })
        };
        const clearUpdate = await Profile.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'photo', 'phone', 'address', 'city'],
            include: [{
                model: User,
                attributes: ['name']
            }]
        });

        return res.status(201).json({
            status: "Success Updated data",
            data: clearUpdate
        })

    } catch (err) {
        next(err);
    }
}

module.exports = {
    readProfile,
    updateProfile
}