'use strict';

const Movies = require('./data/movies');

exports.seed = (Knex) => {
  return Knex('movies').truncate()
  .then(() => {
    return Knex('movies').insert(Movies);
  });
};
