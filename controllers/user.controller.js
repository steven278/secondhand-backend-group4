const { User, Profile } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transportEmail = require('../helper/mailer');
const passValidation = require('password-validator');
const schema = new passValidation();
require('dotenv').config();

const loginUser = async (req, res, next) => {
    // login the user
    try {
        const { email, password } = req.body;
        const loginUser = await User.findOne(
            {
                where: {
                    email: email
                }
            }
        )
        const checkValid = bcrypt.compareSync(password, loginUser.password);

        if (!loginUser) {
            res.status(404).json({
                status: 'fail',
                message: 'Email is not valid'
            })
        } else if (!checkValid) {
            res.status(400).json({
                status: 'fail',
                message: 'Invalid password'
            })
        }

        if (checkValid) {
            const payload = {
                id: loginUser.id,
                email: loginUser.email,
                iat: Date.now()
            }

            const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '3h' });

            return res.status(200).json({
                token: token
            })
        } else {
            return res.status(401).json({
                message: 'Failed Login'
            })
        }
    } catch (err) {
        console.log(err)
        next(err)
    }
}

const registUser = async (req, res, next) => {
    try {
        schema
            .is().min(8)
            .is().max(50)
            .has().uppercase()
            .has().lowercase()

        const passValid = schema.validate(req.body.password, { details: true })

        if (passValid.length > 0) {
            return res.status(400).json({
                status: 'Invalid password',
                message: passValid
            })
        }
        const getProfile = await Profile.create({
            photo: null,
            name: null,
            city: null,
            address: null,
            phone: null
        })
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            profile_id: getProfile.id,
            isVerified: false
        })

        // console.log(getDataRegister)
        const { email } = req.body;
        const greet = `Thank you for registering your account in our website`;
        const emailResponse = await transportEmail(email, greet);

        return res.status(201).json({
            status: "success",
            message: `Email sent to ${emailResponse.accepted.join(',').split(',')}`
        });
    } catch (err) {
        next(err);
    }
}



module.exports = {
    loginUser,
    registUser
}