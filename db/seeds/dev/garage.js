
exports.seed = function(knex, Promise) {
  return knex('garage').del()
    .then(function () {
      return Promise.all([
        knex('garage').insert({ name: 'Mountian Bike', reason: 'unused', cleanliness: 'Dusty' }),
        knex('garage').insert({ name: 'Treadmill', reason: 'unused', cleanliness: 'Dusty' }),
        knex('garage').insert({ name: 'Lawn Mower', reason: 'unused', cleanliness: 'Rancid' }),
        knex('garage').insert({ name: 'Tennis Racket', reason: 'broken', cleanliness: 'Rancid' }),
      ]);
    });
};
