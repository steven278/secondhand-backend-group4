const { User, Profile } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transportEmail = require('../helper/mailer');
require('dotenv').config();

const loginUser = (req, res, next) => {
    // login the user
}

const registUser = async (req, res, next) => {
    try {
        const register = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isVerified: false,
        })
        console.log(register)
        if (register) {
            await Profile.create({
                photo: null,
                phone: null,
                address: null,
                city: null,
            })
        };

        const clearRegist = await User.findOne({
            where: {
                id: register.id
            },
            include: [{
                model: Profile
            }]
        })

        // console.log(register)
        // const { email } = req.body;
        // const greet = `Thank you for registering your account in our website`;
        // const emailResponse = await transportEmail(email, greet);
        // if (!register) {
        //     res.status(404).json({
        //         status: 'fail',
        //         message: 'cant regist'
        //     })
        // } else {
        //     res.status(201).json({
        //         status: "success",
        //         data: register,
        //         message: `Email sent to ${emailResponse.accepted.join(',').split(',')}`
        //     });
        // }

    } catch (err) {
        next(err);
    }
}
module.exports = {
    loginUser,
    registUser
}