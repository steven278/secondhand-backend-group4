const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const fs = require('fs');
const { Profile } = require('../models');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadPhoto = async (req, res, next) => {
    try {
        if (!req.file) next();
        const folderPath = `my-asset/${req.file.mimetype.split('/')[1]}`;
        const uploadPhoto = await cloudinary.uploader.upload(req.file.path, {
            folder: folderPath,
            resource_type: 'image'
        });
        req.body.photo = uploadPhoto.secure_url;
        next();
    } catch (err) {
        console.log(err)
    }
}

module.exports = uploadPhoto;