const express = require('express');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const config = require('./../utils/config');

const app = express();

mongoose.connect(config.DB.DB_URL, {useNewUrlParser: true})
    .then(() => {
        console.log('Conected');
    })
    .catch(() => {
        console.log('Conection failed');
    });

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Acept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS')
    next();
});

app.use('/api/posts/', postsRoutes);
module.exports = app;