'use strict';

const LOCATIONS = 'locations';
const MOVIES_LOCATIONS = 'movies_locations';

exports.up = (Knex, Promise) => {
  return Knex.schema
  .createTable(LOCATIONS, (table) => {
    table.increments('id').primary();
    table.text('location').notNullable();
  })
  .createTable(MOVIES_LOCATIONS, (table) => {
    table.increments('id').primary();
    table.integer('movie_id').references('id').inTable('movies').notNullable();
    table.integer('location_id').references('id').inTable('locations').notNullable();
  });
};

exports.down = (Knex, Promise) => {
  return Knex.schema
  .dropTable(MOVIES_LOCATIONS)
  .dropTable(LOCATIONS);
};
