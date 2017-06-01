const express = require('express');

const router = express.Router();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

router.get('/garage', (request, response) => {
  database('garage').select().orderBy('name', 'asc')
    .then((allItems) => {
      response.status(200).json(allItems);
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
});

router.get('/garage/:id', (request, response) => {
  const { id } = request.params;

  database('garage').where('id', id)
    .then((item) => {
      if (!item.length) {
        response.status(404).send({ error: 'Item does not exist' });
      } else {
        response.status(200).json(...item);
      }
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
});

router.patch('/garage/item/:id', (request, response) => {
  const { id } = request.params;
  const { cleanliness } = request.body;

  if (!cleanliness) { return response.status(422).send({ error: 'Missing content from patch' }); }

  database('garage').where('id', id).select()
    .then((data) => {
      if (!data.length) {
        response.status(404).send({ error: 'Invalid Item ID' });
      } else {
        database('garage').where('id', id)
        .update({ cleanliness }, ['id', 'name', 'reason', 'cleanliness'])
        .then((updatedItem) => {
          response.status(200).send(...updatedItem);
        })
        .catch((error) => {
          response.status(500).send({ error });
        });
      }
    });
});

router.post('/garage/new', (request, response) => {
  const expectedPost = ['name', 'reason', 'cleanliness'];
  const isMissing = expectedPost.every(param => request.body[param]);
  const garageItem = request.body;

  if (!isMissing) { return response.status(422).send({ error: 'Missing content from post' }); }

  database('garage').insert(garageItem, ['id', 'name', 'reason', 'cleanliness'])
    .then((newItem) => {
      response.status(201).json(newItem);
    })
    .catch((error) => {
      response.status(500).send({ error });
    });
});

module.exports = router;