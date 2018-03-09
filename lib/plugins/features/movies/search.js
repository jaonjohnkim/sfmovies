'use strict';

const Movie = require('../../../models/movie');

const name_search = (name, table) => {
  let levenshtein_cost;

  if (name.length <= 2) {
    levenshtein_cost = 0;
  } else if (name.length <= 4) {
    levenshtein_cost = 1;
  } else {
    levenshtein_cost = Math.round(Math.sqrt(name.length));
  }
  const levenshtein_check = `levenshtein(LOWER(${table}.name), LOWER('${name}'), 1, 2, 1) <= ${levenshtein_cost}`;
  const likeness_check = `${table}.name ILIKE '%${name.replace(' ', '%')}%'`;

  return `${levenshtein_check} OR ${likeness_check}`;
};

const release_year_search = (year) => {
  const years = year.split('-').sort();

  if (years.length > 1) {
    return `int4range(${years[0]}, ${parseInt(years[1]) + 1}) @> movies.release_year`;
  } else {
    return `release_year = ${year}`;
  }
};

exports.search = (query) => {
  const orderByName = `levenshtein(LOWER(name), LOWER('${query.name}')) ASC`;
  let searchQuery;

  if (query.name && (query.release_year || query.release_year_range)) {
    const nameSearch = name_search(query.name, 'year_filtered');
    const year = query.release_year ? query.release_year.toString() : null;
    const yearSearch = release_year_search(year || query.release_year_range);

    searchQuery = function (qb) {
      qb.select('*')
      .from(function () {
        this.select('*')
        .from('movies')
        .whereRaw(yearSearch)
        .as('year_filtered');
      })
      .whereRaw(nameSearch)
      .orderByRaw(orderByName);
    };

  } else if (query.name) {
    const nameSearch = name_search(query.name, 'movies');

    searchQuery = function (qb) {
      qb.select('*')
      .from('movies')
      .whereRaw(nameSearch)
      .orderByRaw(orderByName);
    };

  } else if (query.release_year || query.release_year_range) {
    const year = query.release_year ? query.release_year.toString() : null;
    const yearSearch = release_year_search(year || query.release_year_range);

    searchQuery = function (qb) {
      qb.select('*')
      .from('movies')
      .whereRaw(yearSearch)
      .orderBy('release_year');
    };

  } else {
    return new Movie(query).fetchAll();
  }

  return new Movie().query(searchQuery).fetchAll();

};
