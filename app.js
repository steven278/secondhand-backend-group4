require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const baseUrl = process.env.BASE_URL || '/secondhand';
const { router } = require('./routes/routes');
const morgan = require('morgan');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: ['http://localhost:3000',
        'http://localhost:5000',
        'https://secondhand-group4.herokuapp.com', 'https://second-hand-by-group-4.netlify.app', 'https://second-hand-by-group-4.vercel.app', 'https://second-hand-by-group-4.herokuapp.com', 
            'https://second-hand-front-end-group-4-forked.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
}));

app.use(morgan('dev'));

// app.use(cors());

app.use(`${baseUrl}`, router);

module.exports = app;
