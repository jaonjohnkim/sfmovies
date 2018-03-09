'use strict';

const Controller = require('../../../../lib/plugins/features/movies/controller');
const Knex       = require('../../../../lib/libraries/knex');
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

    const sampleMovies = [
      {
        name: 'Sample Movie',
        release_year: 9990
      },
      {
        name: 'Sample Movie 2',
        release_year: 9991
      },
      {
        name: 'Sample Movie 3',
        release_year: 9992
      },
      {
        name: 'Sample Movie 4',
        release_year: 9993
      },
      {
        name: 'Sa',
        release_year: 9994
      },
      {
        name: 'Samp',
        release_year: 9995
      }
    ];

    before(() => {
      return Knex.raw('TRUNCATE movies CASCADE')
      .then(() => Promise.all(sampleMovies.map((movie) => new Movie().save(movie))))
      .then((movies) => {
        movies.forEach((movie, index) => {
          sampleMovies[index].id = movie.get('id');
        });
      });
    });

    after(() => {
      return new Movie().where('name', 'LIKE', 'Sa%').destroy();
    });

    it('gets a movie by id', () => {
      return Controller.get({ id: sampleMovies[0].id })
      .then((movies) => {
        expect(movies.models[0].get('id')).to.eql(sampleMovies[0].id);
        expect(movies.models[0].get('release_year')).to.eql(sampleMovies[0].release_year);
        expect(movies.models[0].get('name')).to.eql(sampleMovies[0].name);
      });
    });

    it('gets a movie by name', () => {
      return Controller.get({ name: sampleMovies[0].name })
      .then((movies) => {
        movies.models.forEach((movie) => {
          const matched = sampleMovies.find((sample) => sample.id === movie.id);
          expect(matched).to.eql(movie.attributes);
        });
      });
    });

    it('gets movies by release_year', () => {
      return Controller.get({ release_year: 9990 })
      .then((movies) => {
        expect(movies.models[0].get('id')).to.eql(sampleMovies[0].id);
        expect(movies.models[0].get('release_year')).to.eql(sampleMovies[0].release_year);
        expect(movies.models[0].get('name')).to.eql(sampleMovies[0].name);
      });
    });

    it('gets a movie by release_year_range', () => {
      return Controller.get({ release_year_range: '9990-9993' })
      .then((movies) => {
        movies.models.forEach((movie) => {
          const matched = sampleMovies.find((sample) => sample.id === movie.id);
          expect(matched).to.eql(movie.attributes);
        });
      });
    });

    it('gets a movie by name and release_year', () => {
      return Controller.get({
        name: sampleMovies[0].name,
        release_year: 9993
      })
      .then((movies) => {
        expect(movies.models[0].get('id')).to.eql(sampleMovies[3].id);
        expect(movies.models[0].get('release_year')).to.eql(sampleMovies[3].release_year);
        expect(movies.models[0].get('name')).to.eql(sampleMovies[3].name);
      });
    });

    it('gets a movie by name and release_year_range', () => {
      return Controller.get({
        name: sampleMovies[0].name,
        release_year_range: '9992-9993'
      })
      .then((movies) => {
        console.log('MOVIES', movies.models);
        expect(movies.models[0].get('id')).to.eql(sampleMovies[2].id);
        expect(movies.models[0].get('release_year')).to.eql(sampleMovies[2].release_year);
        expect(movies.models[0].get('name')).to.eql(sampleMovies[2].name);
        expect(movies.models[1].get('id')).to.eql(sampleMovies[3].id);
        expect(movies.models[1].get('release_year')).to.eql(sampleMovies[3].release_year);
        expect(movies.models[1].get('name')).to.eql(sampleMovies[3].name);
      });
    });

    it('gets a movie by fuzzy name', () => {
      return Controller.get({ name: 'SmpleMovie' })
      .then((movies) => {
        movies.models.forEach((movie) => {
          const matched = sampleMovies.find((sample) => sample.id === movie.id);
          expect(matched).to.eql(movie.attributes);
        });
      });
    });

    it('gets movies by search string length of 2', () => {
      return Controller.get({
        name: 'Sa'
      })
      .then((movies) => {
        expect(movies.models[0].attributes).to.eql(sampleMovies[4]);
      });
    });

    it('gets no movies by search string length of 2 and 1 typo', () => {
      return Controller.get({
        name: 'La'
      })
      .then((movies) => {
        expect(movies.models.length).to.eql(0);
      });
    });

    it('gets a movie by search string length of 4', () => {
      return Controller.get({
        name: 'Samp'
      })
      .then((movies) => {
        expect(movies.models[0].attributes).to.eql(sampleMovies[5]);
      });
    });

    it('gets a movie by search string length of 4 with 1 typo', () => {
      return Controller.get({
        name: 'Lamp'
      })
      .then((movies) => {
        expect(movies.models[0].attributes).to.eql(sampleMovies[5]);
      });
    });

    it('gets no movies by search string length of 4 with 2 typos', () => {
      return Controller.get({
        name: 'Lamb'
      })
      .then((movies) => {
        expect(movies.models.length).to.eql(0);
      });
    });

  });

});
