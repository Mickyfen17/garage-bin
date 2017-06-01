
exports.seed = function(knex, Promise) {
  return knex('garage').del()
    .then(function () {
      return Promise.all([
        knex('garage').insert({ id: 1, name: 'Mountain Bike', reason: 'unused', cleanliness: 'Dusty' }),
        knex('garage').insert({ id: 2, name: 'Treadmill', reason: 'unused', cleanliness: 'Dusty' }),
        knex('garage').insert({ id: 3, name: 'Lawn Mower', reason: 'unused', cleanliness: 'Rancid' }),
        knex('garage').insert({ id: 4, name: 'Tennis Racket', reason: 'broken', cleanliness: 'Rancid' }),
      ]);
    });
};
