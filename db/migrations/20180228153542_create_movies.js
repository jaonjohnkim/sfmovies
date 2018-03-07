'use strict';

const MOVIES = 'movies';

exports.up = (Knex, Promise) => {
  return Knex.schema.createTable(MOVIES, (table) => {
    table.increments('id').primary();
    table.text('title').notNullable();
    table.integer('release_year');
  });
};

exports.down = (Knex, Promise) => {
  return Knex.schema.dropTable(MOVIES);
};
