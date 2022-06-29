const { user, profile } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transportEmail = require('../helper/mailer');
require('dotenv').config();

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

const loginUser = (req, res, next) => {
    // login the user
}

const registUser = async (req, res, next) => {
    try {
        const register = await user.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isVerified: false
        })
        if (register) {
            await profile.create({
                photo: NULL,
                phone: NULL,
                address: NULL,
                city: NULL,
            })
        }
        console.log(register)
        const { email } = req.body;
        const greet = `Thank you for registering your account in our website`;
        const emailResponse = await transportEmail(email, greet);
        if (!register) {
            res.status(404).json({
                status: 'fail',
                message: 'cant regist'
            })
        } else {
            res.status(201).json({
                status: "success",
                data: register,
                message: `Email sent to ${emailResponse.accepted.join(',').split(',')}`
            });
        }

    } catch (err) {
        next(err);
    }
}
module.exports = {
    readUserDataById,
    loginUser,
    registUser
}