'use strict';

const Movie = require('../../../models/movie');

exports.create = (payload) => {
  payload.name = payload.title;
  return new Movie().save(payload)
  .then((movie) => {
    return new Movie({ id: movie.id }).fetch();
  });
};
