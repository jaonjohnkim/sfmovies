'use strict';

const Controller = require('../../../../lib/plugins/features/movies/controller');
const Movie      = require('../../../../lib/models/movie');

describe('movie controller', () => {

  describe('create', () => {

    it('creates a movie', () => {
      const payload = { title: 'WALL-E' };

      return Controller.create(payload)
      .then((movie) => {
        expect(movie.get('name')).to.eql(payload.name);
      });
    });

  });

  describe('get', () => {

    const sampleMovie = {
      name: 'Sample Movie',
      release_year: 9999
    };

    before(() => {
      return new Movie().save(sampleMovie)
      .then((movie) => {
        sampleMovie.id = movie.get('id');
      });
    });

    it('gets a movie from id', () => {
      return Controller.get({ id: sampleMovie.id })
      .then((movie) => {
        expect(movie.get('id')).to.eql(sampleMovie.id);
        expect(movie.get('release_year')).to.eql(sampleMovie.release_year);
        expect(movie.get('name')).to.eql(sampleMovie.name);
      });
    });

    it('gets a movie from name', () => {
      return Controller.get({ name: sampleMovie.name })
      .then((movie) => {
        expect(movie.get('id')).to.eql(sampleMovie.id);
        expect(movie.get('release_year')).to.eql(sampleMovie.release_year);
        expect(movie.get('name')).to.eql(sampleMovie.name);
      });
    });

    it('gets movies from release_year', () => {
      return Controller.get({ release_year: sampleMovie.release_year })
      .then((movie) => {
        expect(movie.get('id')).to.eql(sampleMovie.id);
        expect(movie.get('release_year')).to.eql(sampleMovie.release_year);
        expect(movie.get('name')).to.eql(sampleMovie.name);
      });
    });

    after(() => {
      return new Movie().where('name', 'Sample Movie').destroy();
      // .then((response) => {
      //   console.log('DESTROY RESPONSE', response);
      // });
    });

  });

});
