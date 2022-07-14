require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadWithCloudinary = async (req, res, next) => {
    try {
        console.log('cloudinaaryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')
        const foldering = `my-asset/${req.files[0].mimetype.split('/')[1]}`;
        const photos = [];
        for (const file of req.files) {
            const uploadResult = await cloudinary.uploader.upload(file.path, {
                resource_type: "image",
                folder: foldering
            });
            photos.push(uploadResult.secure_url);
        }
        req.body.photos = photos;
        next();
    } catch (err) {
        res.status(200).json({ err: err })
    }
};

module.exports = uploadWithCloudinary;
