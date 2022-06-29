const { profile, user } = require('../models/profile');

// const addProfile = async (req, res, next) => {
//     // add the profile user
//     try {
//         const addProfile = await profile.create({
//             // photo: req.file.photo,
//             phone: req.body.phone,
//             address: req.body.address,
//             city: req.body.city
//         })
//         if (!addProfile) {
//             res.status(404).json({
//                 message: 'Failed to add data'
//             })
//         } else {
//             res.status(200).json({
//                 data: addProfile
//             })
//         }
//     } catch (err) {
//         next(err);
//     }
// }

const readProfile = async (req, res) => {
    // get the profile user
    try {
        const profileUser = await profile.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'photo', 'phone', 'address', 'city'],
            includes: [{
                model: user,
                where: {
                    email: req.body.email,
                    name: req.body.name
                }
            }]
        });
        if (!profileUser) {
            res.status(404).json({
                status: 'fail',
                message: 'Failed to get data'
            })
        } else {
            res.status(200).json({
                data: profileUser
            })
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
}

const updateProfile = async (req, res, next) => {
    try {
        const updateProfile = await profile.update({
            address: req.body.address,
            city: req.body.city,
            phone: req.body.phone,
            updatedAt: new Date()
        }, { where: { id: req.params.id } })

        if (updateProfile) {
            await user.update({
                name: req.body.name,
                updatedAt: new Date()
            }, { where: { id: req.params.id } })
        };

        const clearUpdate = await profile.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: user
            }]
        });

        res.status(201).json({
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