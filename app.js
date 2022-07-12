require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const corsOptions = {
    origin: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

const baseUrl = process.env.BASE_URL || '/secondhand';
const { router } = require('./routes/routes');
const morgan = require('morgan');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use(morgan('dev'));

app.use(`${baseUrl}`, router);

module.exports = app;

// app.use(cors());
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Headers, *, Access-Control-Allow-Origin', 'Origin, X-Requested-with, Content_Type,Accept,Authorization', 'http://localhost:3000');
//     if (req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
//         return res.status(200).json({});
//     }
//     next();
// });