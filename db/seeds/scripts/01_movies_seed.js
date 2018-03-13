'use strict';

const Movies = require('../data/movies');
const MOVIES = 'movies';

exports.seed = (Knex) => {
  return Knex.raw(`TRUNCATE ${MOVIES} cascade`)
  .then(() => Knex(MOVIES).insert(Movies));
};
