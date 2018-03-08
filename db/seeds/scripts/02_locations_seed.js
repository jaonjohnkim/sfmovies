'use strict';

const Locations = require('../data/locations');
const LOCATIONS = 'locations';

exports.seed = (Knex) => {
  console.log('Seeding 2nd');
  return Knex.raw(`TRUNCATE ${LOCATIONS} cascade`)
  .then(() => Knex(LOCATIONS).insert(Locations));
};
