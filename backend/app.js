const path = require('path'); // Allow to build path in a safe way, regardless the OS
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

// Allow to access to the image folder
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Acept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS')
    next();
});

app.use('/api/posts/', postsRoutes);
module.exports = app;