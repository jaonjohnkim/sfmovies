'use strict';

const Movies_Locations = require('../data/movies_locations');
const MOVIES_LOCATIONS = 'movies_locations';

exports.seed = (Knex) => {
  return Knex.raw(`TRUNCATE ${MOVIES_LOCATIONS}`)
  .then(() => Knex(MOVIES_LOCATIONS).insert(Movies_Locations));
};