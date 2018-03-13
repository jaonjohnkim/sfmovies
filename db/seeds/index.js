'use strict';

const moviesSeed          = require('./scripts/01_movies_seed');
const locationsSeed       = require('./scripts/02_locations_seed');
const moviesLocationsSeed = require('./scripts/03_movies_locations_seed');

exports.seed = (Knex) => {
  return moviesSeed.seed(Knex)
  .then(() => locationsSeed.seed(Knex))
  .then(() => moviesLocationsSeed.seed(Knex));
};
