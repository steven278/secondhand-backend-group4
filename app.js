require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const baseUrl = process.env.BASE_URL || '/secondhand';
const { router } = require('./routes/routes');
const morgan = require('morgan');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(morgan('dev'));

app.use(`${baseUrl}`, router);

module.exports = app;
