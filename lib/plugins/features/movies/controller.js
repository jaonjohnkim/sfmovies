'use strict';

const Movie = require('../../../models/movie');

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
  if (Object.keys(query).length > 0) {
    if (query.title) {
      renameTitleToName(query);
    }
    return new Movie(query).fetch();
  } else {
    return new Movie().fetchAll();
  }
};
