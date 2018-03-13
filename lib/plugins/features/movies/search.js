'use strict';

const Movie = require('../../../models/movie');

const nameSearch = (name, table) => {
  let levenshteinCost;

  if (name.length <= 2) {
    levenshteinCost = 0;
  } else if (name.length <= 4) {
    levenshteinCost = 1;
  } else {
    levenshteinCost = Math.round(Math.sqrt(name.length));
  }
  const levenshteinCheck = `levenshtein(LOWER(${table}.name), LOWER('${name}'), 1, 1, 1) <= ${levenshteinCost}`;
  const likenessCheck = `${table}.name ILIKE '%${name.replace(' ', '%')}%'`;

  return `${levenshteinCheck} OR ${likenessCheck}`;
};

const releaseYearSearch = (year) => {
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
    const nameResult = nameSearch(query.name, 'year_filtered');
    const year = query.release_year ? query.release_year.toString() : null;
    const yearResult = releaseYearSearch(year || query.release_year_range);

    searchQuery = function (qb) {
      qb.select('*')
      .from(function () {
        this.select('*')
        .from('movies')
        .whereRaw(yearResult)
        .as('year_filtered');
      })
      .whereRaw(nameResult)
      .orderByRaw(orderByName);
    };

  } else if (query.name) {
    const nameResult = nameSearch(query.name, 'movies');

    searchQuery = function (qb) {
      qb.select('*')
      .from('movies')
      .whereRaw(nameResult)
      .orderByRaw(orderByName);
    };

  } else if (query.release_year || query.release_year_range) {
    const year = query.release_year ? query.release_year.toString() : null;
    const yearResult = releaseYearSearch(year || query.release_year_range);

    searchQuery = function (qb) {
      qb.select('*')
      .from('movies')
      .whereRaw(yearResult)
      .orderBy('release_year');
    };

  } else {
    return new Movie().where(query).fetchAll();
  }

  return new Movie().query(searchQuery).fetchAll();

};
