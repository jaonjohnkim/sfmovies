'use strict';

const Movie  = require('../../../models/movie');
const Search = require('./search');

const renameTitleToName = (obj) => {
  obj.name = obj.title;
  Reflect.deleteProperty(obj, 'title');
};

exports.create = (payload) => {
  renameTitleToName(payload);
  return new Movie().save(payload)
  .then((movie) => new Movie({ id: movie.id }).fetch());
};

exports.get = (query) => {
  if (query.title) {
    renameTitleToName(query);
  }
  return Search.search(query);
};
