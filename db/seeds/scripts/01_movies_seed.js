'use strict';

const Movies = require('../data/movies');
const MOVIES = 'movies';

exports.seed = (Knex) => {
  console.log('Seeding 1st');
  return Knex.raw(`TRUNCATE ${MOVIES} cascade`)
  .then(() => Knex(MOVIES).insert(Movies));
};
