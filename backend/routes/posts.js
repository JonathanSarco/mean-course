const express = require('express');
const Post = require('../models/post');
const multer = require('multer');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Return undefined if there is no match with mime type
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }

        // The path is relative to the Server.js file 
        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

// Express can we pass as many arguments as we want, the will execute from L to R
router.post("", multer({storage: storage}).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename
    });

    post.save().then(result => {
        res.status(201).json({
            message: 'Post added',
            post: {
                ...result,
                id: result._id
            }

        });
    });    
});

router.put("/:id", multer({storage: storage}).single('image'), (req, res, next) => {
    let imagePath = req.body.imagePath;
    // If is not undefined (because if we upload a string is going to be undefined), we change it
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    }
    
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });

    Post.updateOne({_id: req.params.id}, post).then(result => {
        console.log(result);
        res.status(200).json({message: 'Update sucessful!'});
    })
});

router.get("", (req, res, next) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: 'Post fetched correctly',
            posts: documents
        });
    })
});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: "Post not found"});
        }
    })
    .catch((error) => {
        res.status(500).json({message: error.message});
    });
});

router.delete("/:id", (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: "Posts deleted"});
    })
});

module.exports = router;

function hasValue(str){
    if(str && str.length > 0){
        return true;
    }
    return false;
}
