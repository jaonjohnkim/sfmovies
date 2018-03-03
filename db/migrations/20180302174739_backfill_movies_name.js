'use strict';

exports.up = (Knex, Promise) => {
  return Knex.raw('UPDATE movies SET name = title');
};

exports.down = (Knex, Promise) => {
  return Promise.resolve();
};
