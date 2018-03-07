'use strict';

const MOVIES = 'movies';

exports.up = (Knex, Promise) => {
  return Knex.raw(`UPDATE ${MOVIES} SET name = title WHERE name IS NULL`);
};

exports.down = (Knex, Promise) => {
  return Promise.resolve();
};
