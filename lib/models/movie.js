'use strict';

const Bookshelf = require('../libraries/bookshelf');

module.exports = Bookshelf.Model.extend({
  tableName: 'movies',
  serialize: function () {
    return {
      id: this.get('id'),
      name: this.get('title'),
      title: this.get('title'),
      release_year: this.get('release_year'),
      object: 'movie'
    };
  }
});
