require('dotenv').config();
const express = require('express');
const app = express();

const baseUrl = process.env.BASE_URL || '/secondhand';
const { router } = require('./routes/routes');
const morgan = require('morgan');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(morgan('dev'));

app.use(`${baseUrl}`, router);

module.exports = app;
