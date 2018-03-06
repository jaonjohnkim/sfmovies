'use strict';

exports.up = (Knex, Promise) => {
  return Knex.raw('UPDATE movies SET name = title WHERE name IS NULL');
};

exports.down = (Knex, Promise) => {
  return Promise.resolve();
};
