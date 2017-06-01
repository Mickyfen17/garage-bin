const chai = require('chai');

const should = chai.should();
const chaiHttp = require('chai-http');

process.env.NODE_ENV = 'test';

const configuration = require('../knexfile').test;
const database = require('knex')(configuration);
const server = require('../server/index');

chai.use(chaiHttp);

describe('API Routes', () => {
  beforeEach((done) => {
    database.migrate.latest()
    .then(() => {
      return database.seed.run();
    })
    .then(() => {
      done();
    });
  });

  afterEach((done) => {
    database.seed.run()
    .then(() => {
      done();
    });
  });

  describe('GET /api/v1/garage', () => {
    it('should return an array of objects from the garage database', (done) => {
      chai.request(server)
      .get('/api/v1/garage')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.length.should.equal(4);
        response.body[0].should.have.property('id');
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('reason');
        response.body[0].should.have.property('cleanliness');
        done();
      });
    });

    it('should throw an error on a failed GET to /garage', (done) => {
      chai.request(server)
      .get('/api/v1/garagez')
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'Not Found' });
        done();
      });
    });
  });

  describe('GET /api/v1/garage/:id', () => {
    it('should return a specific item from the garage', (done) => {
      chai.request(server)
      .get('/api/v1/garage/2')
      .end((error, response) => {
        response.should.have.status(200);
        response.body.id.should.equal(2);
        response.body.name.should.equal('Treadmill');
        response.body.reason.should.equal('unused');
        response.body.cleanliness.should.equal('Dusty');
        done();
      });
    });

    it('should return an error if a request item does not exisit in the garage database', (done) => {
      chai.request(server)
      .get('/api/v1/garage/2000')
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'Item does not exist' });
        done();
      });
    });
  });

  describe('POST /api/v1/garage/new', () => {
    it('should be able to update an item already in the database', (done) => {
      chai.request(server)
      .post('/api/v1/garage/new')
      .send({
        name: 'Roller Skates',
        reason: 'Broken',
        cleanliness: 'Rancid',
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.body[0].name.should.equal('Roller Skates');
        response.body[0].reason.should.equal('Broken');
        response.body[0].cleanliness.should.equal('Rancid');
        done();
      });
    });

    it('should return an error of 422 if content to missing from the request body', (done) => {
      chai.request(server)
      .post('/api/v1/garage/new')
      .send({
        name: 'Gardening Tools',
        cleanliness: 'Rancid',
      })
      .end((error, response) => {
        response.should.have.status(422);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'Missing content from post' });
        done();
      });
    });
  });

  describe('PATCH /api/v1/garage/item/:id', () => {
    it('should be able to update an item already in the database', (done) => {
      chai.request(server)
      .get('/api/v1/garage/1')
      .end((error, response) => {
        response.should.have.status(200);
        response.body.id.should.equal(1);
        response.body.name.should.equal('Mountain Bike');
        response.body.reason.should.equal('unused');
        response.body.cleanliness.should.equal('Dusty');
        chai.request(server)
        .patch('/api/v1/garage/item/1')
        .send({ cleanliness: 'Rancid' })
        .end((error, response) => {
          response.should.have.status(200);
          response.body.id.should.equal(1);
          response.body.name.should.equal('Mountain Bike');
          response.body.reason.should.equal('unused');
          response.body.cleanliness.should.equal('Rancid');
          done();
        });
      });
    });

    it('should return an error of 422 if content to missing from the request body', (done) => {
      chai.request(server)
      .patch('/api/v1/garage/item/1')
      .send({ })
      .end((error, response) => {
        response.should.have.status(422);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'Missing content from patch' });
        done();
      });
    });

    it('should return an error of 404 if the item does not exisit it the garage database', (done) => {
      chai.request(server)
      .patch('/api/v1/garage/item/1000')
      .send({ cleanliness: 'Rancid' })
      .end((error, response) => {
        response.should.have.status(404);
        response.body.should.have.property('error');
        response.body.should.deep.equal({ error: 'Invalid Item ID' });
        done();
      });
    });
  });
});