"use strict";
const nodemailer = require('nodemailer');
require('dotenv').config();

const mailer = (email, message) => {
    let transporter = '';
    let mailOptions = '';

    mailOptions = {
        from: 'secondhandg4@gmail.com',
        to: email,
        subject: `Hello and Thank you for registering ${email}`,
        text: message
    }

    console.log(mailOptions);
    transporter = nodemailer.createTransport({
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        auth: {
            user: process.env.USER_MAIL,
            pass: process.env.SMTP_PASS
        }
    })

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(err)
            } else {
                resolve(info)
            }
        })
    })

}

module.exports = mailer;