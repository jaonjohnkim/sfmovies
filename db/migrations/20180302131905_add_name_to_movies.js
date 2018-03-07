'use strict';

const MOVIES = 'movies';

exports.up = (Knex, Promise) => {
  return Knex.schema.table(MOVIES, (table) => {
    table.text('name');
  })
  .then(() => {
    return Knex.raw('ALTER TABLE movies ALTER COLUMN title DROP NOT NULL');
  });
};

exports.down = (Knex, Promise) => {
  return Knex.schema.table(MOVIES, (table) => {
    table.dropColumn('name');
  })
  .then(() => {
    return Knex.raw('ALTER TABLE movies ALTER COLUMN title SET NOT NULL');
  });
};
