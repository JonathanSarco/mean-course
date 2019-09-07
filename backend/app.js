const express = require('express');
const bodyParse = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect('mongodb://localhost:27017/meandb', {useNewUrlParser: true})
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


app.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save().then(item => {
        console.log('Save item ' + item);
    });    
    
    res.status(201).json({
        message: 'Post added'
    });
});

app.get("/api/posts", (req, res, next) => {
    const posts = [
        {
            id: '123', 
            title: 'Alto titulo', 
            content: 'this is from server'
        }
    ];
    
    res.status(200).json({
        message: 'Post fetched correctly',
        posts: posts
    });
});

module.exports = app;