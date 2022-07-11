const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const fileType = file.mimetype.split('/')[1];
        cb(null, file.fieldname + '-' + Date.now() + `${fileType}`);
    }
});


const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // The function should call `cb` with a boolean
        // to indicate if the file should be accepted
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') return cb(null, true);
        // To reject this file pass `false`, like so:
        // To reject this file pass false, like so:
        cb(null, false);
        // You can always pass an error if something goes wrong:
        return cb(new Error('Wrong filetype'));
    },
    limits: {
        fileSize: 5000000 //5 MB
    }
});

const uploadProfile = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // The function should call `cb` with a boolean
        // to indicate if the file should be accepted
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') return cb(null, true);
        // To reject this file pass `false`, like so:
        // To reject this file pass false, like so:
        cb(null, false);
        // You can always pass an error if something goes wrong:
        return cb(new Error('Wrong filetype'));
    },
    limits: {
        fileSize: 3000000 //5 MB
    }
});

module.exports = { upload, uploadProfile };