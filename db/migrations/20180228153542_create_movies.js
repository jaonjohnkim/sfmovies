'use strict';

exports.up = (Knex, Promise) => {
  return Knex.schema.createTable('movies', (table) => {
    table.increments('id').primary();
    table.text('title').notNullable();
    table.integer('release_year');
  });
};

exports.down = (Knex, Promise) => {
  return Knex.schema.dropTable('movies');
};
