var assert = require('assert');
let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const config = require('./../utils/config');
const Post = require('./../backend/models/post');
const mongoose = require('mongoose');


const url = config.BASE_URL_BE;

chai.use(chaiHttp);

/**
 * Clean the test data base
 */
mongoose.connect(config.DB.DB_URL, function () {
  /* Drop the DB */
  mongoose.connection.db.dropDatabase();
});


/**
 * Test Crud operations
 */

describe('CRUD Operations: ', function () {
  let posts = [
    new Post({ title: 'I am the first test post', content: 'I am the first test content post' }),
    new Post({ title: 'I am the second test post', content: 'I am the second test content post' }),
    new Post({ title: 'I am the third test post', content: 'I am the third test content post' })
  ]
  let ids = [];

  it('should return an empty array', (done) => {
    chai.request(url)
      .get('/api/posts')
      .end(function (err, res) {
        console.log(res.body)
        expect(res).to.have.status(200);
        expect(res.body.posts).to.have.lengthOf(0);
        done();
      });
  });

  it('should add post to the data base', (done) => {
    posts.forEach(post => {
      chai.request(url)
        .post('/api/posts')
        .send(post)
        .end(function (err, res) {
          console.log(res.body);
          ids.push(res.body.postId);
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message').to.be.equal('Post added');
          expect(res.body).to.have.property('postId').to.not.equal(null);
          expect(res.body.postId).to.not.equal('');
        });
    });
    done();
  });

  it('should return three post in the array', (done) => {
    chai.request(url)
      .get('/api/posts')
      .end(function (err, res) {
        console.log(res.body);

        expect(res).to.have.status(200);
        expect(res.body).to.not.equal(null);
        expect(res.body).to.have.property('message').to.be.equal('Post fetched correctly');
        expect(res.body).to.have.property('posts').to.not.equal(null);
        expect(res.body.posts).not.to.have.lengthOf(0);

        done();
      });
  });

  it('should return one post in the array with the searchId', (done) => {
    console.log(ids[1]);

    chai.request(url)
      .get(`/api/posts/${ids[1]}`)
      .end(function (err, res) {
        console.log(res.body);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id').to.be.equal(ids[1]);

        done();
      });
  });

  it('Should delete all the posts', (done) => {
    console.log(ids[1]);
    ids.forEach(id => {
      chai.request(url)
        .delete(`/api/posts/${id}`)
        .end(function (err, res) {
          console.log(res.body);

          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message').to.be.equal('Posts deleted');
        });
    });
    done();
  });

  it('should return an empty array', (done) => {
    chai.request(url)
      .get('/api/posts')
      .end(function (err, res) {
        console.log(res.body)
        expect(res).to.have.status(200);
        expect(res.body.posts).to.have.lengthOf(0);
        done();
      });
  });
});