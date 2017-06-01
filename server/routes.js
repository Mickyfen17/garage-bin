const express = require('express');

const router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

router.get('/garage', (request, response) => {
  database('garage').select()
    .then((allItems) => {
      response.status(200).json(allItems);
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
});

module.exports = router;