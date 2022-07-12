require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const baseUrl = process.env.BASE_URL || '/secondhand';
const { router } = require('./routes/routes');
const morgan = require('morgan');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


// const corsOptions = {
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true,
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

app.use(cors({ credentials: true, origin: ['http://localhost:3000', 'http://localhost:5000', ' https://secondhand-group4.herokuapp.com/secondhand', 'https://second-hand-by-group-4.netlify.app'] }));
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(morgan('dev'));

// app.use(cors());

app.use(`${baseUrl}`, router);

module.exports = app;
