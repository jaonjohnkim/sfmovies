'use strict';

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

    it('gets a list of movies', () => {
      return Movies.inject({
        url: '/movies',
        method: 'GET'
      }).then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(Array.isArray(response.result)).to.eql(true);
      });
    });

    let sampleMovie = {
      title: 'Sample Movie',
      release_year: 9999
    };

    before(() => {
      return Movies.inject({
        url: '/movies',
        method: 'POST',
        payload: sampleMovie
      }).then((response) => {
        sampleMovie = response.result;
      });
    });

    it('gets a movie with an id', () => {
      return Movies.inject({
        url: `/movies?id=${sampleMovie.id}`,
        method: 'GET'
      }).then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(response.result).to.eql(sampleMovie);
      });
    });

    it('gets a movie with a release year', () => {
      return Movies.inject({
        url: `/movies?release_year=${sampleMovie.release_year}`,
        method: 'GET'
      }).then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(response.result).to.eql(sampleMovie);
      });
    });

    it('gets a movie with a title', () => {
      return Movies.inject({
        url: `/movies?title=${sampleMovie.title}`,
        method: 'GET'
      }).then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(response.result).to.eql(sampleMovie);
      });
    });

    it('gets a movie with a release year and title', () => {
      return Movies.inject({
        url: `/movies?title=${sampleMovie.title}&release_year=${sampleMovie.release_year}`,
        method: 'GET'
      }).then((response) => {
        expect(response.statusCode).to.eql(200);
        expect(response.result).to.eql(sampleMovie);
      });
    });

    after(() => {
      return new Movie().where('name', 'Sample Movie').destroy();
    });

  });

  describe('responds with the correct error', () => {

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
