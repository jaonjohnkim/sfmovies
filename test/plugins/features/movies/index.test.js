'use strict';

const Knex   = require('../../../../lib/libraries/knex');
const Movies = require('../../../../lib/server');
const Movie  = require('../../../../lib/models/movie');

describe('movies integration', () => {

  describe('create', () => {

    it('creates a movie', () => {
      return Movies.inject({
        url: '/movies',
        method: 'POST',
        payload: { title: 'Volver' }
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(response.result.object).to.eql('movie');
        expect(response.result.title).to.eql('Volver');
      });
    });

  });

  describe('get', () => {

    const sampleMovies = [
      {
        name: 'Sample Movie',
        release_year: 9989
      },
      {
        name: 'Sample Movie 2',
        release_year: 9988
      },
      {
        name: 'Sample Movie 3',
        release_year: 9987
      },
      {
        name: 'Sample Movie 4',
        release_year: 9986
      }
    ];

    before(() => {
      return Knex.raw('TRUNCATE movies CASCADE')
      .then(() => Promise.all(sampleMovies.map((movie) => new Movie().save(movie))))
      .then((movies) => {
        movies.forEach((movie, index) => {
          sampleMovies[index].id = movie.get('id');
          sampleMovies[index].title = sampleMovies[index].name;
          sampleMovies[index].object = 'movie';
          Reflect.deleteProperty(sampleMovies[index], 'name');
        });
      });
    });

    after(() => {
      return new Movie().where('name', 'LIKE', 'Sa%').destroy();
    });

    it('gets a movie by a release year', () => {
      return Movies.inject({
        url: '/movies?release_year=9989',
        method: 'GET'
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(response.result[0]).to.eql(sampleMovies[0]);
      });
    });

    it('gets a movie by a title', () => {
      return Movies.inject({
        url: '/movies?title=Sample Movie',
        method: 'GET'
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
        response.result.forEach((movie) => {
          const matched = sampleMovies.find((sample) => sample.id === movie.id);
          expect(matched).to.eql(movie);
        });
      });
    });

    it('gets a movie by a release year and title', () => {
      return Movies.inject({
        url: '/movies?title=Sample Movie&release_year=9987',
        method: 'GET'
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(response.result[0]).to.eql(sampleMovies[2]);
      });
    });

    it('gets a movie by a release year range', () => {
      return Movies.inject({
        url: '/movies?release_year_range=9987-9989',
        method: 'GET'
      })
      .then((response) => {
        expect(response.statusCode).to.eql(200);
        response.result.forEach((movie) => {
          const matched = sampleMovies.find((sample) => sample.id === movie.id);
          expect(matched).to.eql(movie);
        });
      });
    });

  });

  describe('responds with the correct error', () => {

    it('responds with a 422 when no query parameters', () => {
      return Movies.inject({
        url: '/movies',
        method: 'GET'
      })
      .then((response) => {
        expect(response.statusCode).to.eql(422);
        expect(response.result.error.message).to.eql('title or release_year is required');
      });
    });

    it('responds with a 422 and correct error message for no title', () => {
      return Movies.inject({
        url: '/movies',
        method: 'POST',
        payload: { asdf: 'Wrong Prop' }
      })
      .then((response) => {
        expect(response.statusCode).to.eql(422);
        expect(response.result.error.message).to.eql('title is required');
      });
    });

    it('responds with a 422 and correct error message for wrong release_year type', () => {
      return Movies.inject({
        url: '/movies',
        method: 'POST',
        payload: {
          title: 'Correct Title',
          release_year: 'Wrong Release Year Type'
        }
      })
      .then((response) => {
        expect(response.statusCode).to.eql(422);
        expect(response.result.error.message).to.eql('release_year must be a number');
      });
    });

    it('responds with a 422 and correct error message for invalid year', () => {
      return Movies.inject({
        url: '/movies',
        method: 'POST',
        payload: {
          title: 'Correct Title',
          release_year: '-1234'
        }
      })
      .then((response) => {
        expect(response.statusCode).to.eql(422);
        expect(response.result.error.message).to.eql('release_year must be larger than or equal to 1878');
      });

    });

  });

});
