'use strict';

exports.up = (Knex) => {
  return Knex.raw('CREATE EXTENSION fuzzystrmatch;');
};

exports.down = (Knex, Promise) => {
  return Promise.resolve();
};
