const { Profile, User } = require('../models');
const uploadPhoto = require('../helper/uploadService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

const addProfile = async (req, res, next) => {
    try {
        const addProfile = await Profile.create({
            id: req.user.id,
            photo: req.body.photo,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
        })
        if (addProfile) {
            return res.status(201).json({
                status: 'success',
                data: addProfile
            })
        } else {
            return res.status(404).json({
                status: 'failed',
                message: 'Need all data to be filled'
            })
        }

    } catch (err) {
        next(err);
    }
}

const updateProfile = async (req, res, next) => {
    console.log(req.user)
    return
    try {
        const updateProfile = await Profile.update({
            address: req.body.address,
            city: req.body.city,
            phone: req.body.phone,
            updatedAt: new Date()
        }, { where: { id: req.params.id } })

        if (updateProfile) {
            await User.update({
                name: req.body.name,
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
    addProfile,
    updateProfile
}