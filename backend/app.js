const express = require('express');
const bodyParse = require('body-parser');

const app = express();

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Acept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS')
    next();
});


app.post("/api/posts", (req, res, next) => {
    const post = req.body;
    console.log(post);    
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