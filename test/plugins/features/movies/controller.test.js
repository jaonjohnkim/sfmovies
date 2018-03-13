'use strict';

const Controller = require('../../../../lib/plugins/features/movies/controller');
const Knex       = require('../../../../lib/libraries/knex');
const Movie      = require('../../../../lib/models/movie');
const Bluebird   = require('bluebird');

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
        name: 'Ma',
        release_year: 9994
      },
      {
        name: 'Camp',
        release_year: 9995
      }
    ];

    const fields = ['id', 'release_year'];

    before(() => {
      return Knex.raw('TRUNCATE movies CASCADE')
      .then(() => Bluebird.all(sampleMovies.map((movie) => new Movie().save(movie))))
      .then((movies) => {
        movies.forEach((movie, index) => {
          sampleMovies[index].id = movie.get('id');
        });
      });
    });

    after(() => {
      return new Movie().where('name', 'LIKE', 'Sa%').destroy();
    });

    fields.forEach((field) => {
      it(`gets a movie by ${field}`, () => {
        return Controller.get({ [field]: sampleMovies[0][field] })
        .then((movies) => {
          expect(movies.models.length).to.eql(1);
          expect(movies.models[0].attributes).to.eql(sampleMovies[0]);
        });
      });
    });

    it('gets a movie by name', () => {
      const expectedOutput = sampleMovies.slice(0, 4);

      return Controller.get({ name: 'Sample Movie' })
      .then((movies) => {
        expect(movies.length).to.eql(4);
        expect(movies.models.map((movie) => movie.attributes)).to.eql(expectedOutput);
      });
    });

    it('gets a movie by release_year_range', () => {
      const expectedOutput = sampleMovies.slice(0, 4);
      return Controller.get({ release_year_range: '9990-9993' })
      .then((movies) => {
        expect(movies.length).to.eql(4);
        expect(movies.models.map((movie) => movie.attributes)).to.eql(expectedOutput);
      });
    });

    it('gets a movie by name and release_year', () => {
      const expectedOutput = sampleMovies[3];

      return Controller.get({
        name: sampleMovies[0].name,
        release_year: 9993
      })
      .then((movie) => {
        expect(movie.models.length).to.eql(1);
        expect(movie.models[0].attributes).to.eql(expectedOutput);
      });
    });

    it('gets a movie by name and release_year_range', () => {
      const expectedOutput = sampleMovies.slice(2, 4);

      return Controller.get({
        name: sampleMovies[0].name,
        release_year_range: '9992-9993'
      })
      .then((movies) => {
        expect(movies.models.length).to.eql(2);
        expect(movies.models.map((movie) => movie.attributes)).to.eql(expectedOutput);
      });
    });

    it('gets a movie by fuzzy name', () => {
      const expectedOutput = sampleMovies[0];

      return Controller.get({ name: 'Smple Movi' })
      .then((movies) => {
        expect(movies.models.length).to.eql(1);
        expect(movies.models[0].attributes).to.eql(expectedOutput);
      });
    });

    it('gets movies by search string length of 2', () => {
      return Controller.get({
        name: 'Ma'
      })
      .then((movies) => {
        expect(movies.models.length).to.eql(1);
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
        name: 'Camp'
      })
      .then((movies) => {
        expect(movies.models.length).to.eql(1);
        expect(movies.models[0].attributes).to.eql(sampleMovies[5]);
      });
    });

    it('gets a movie by search string length of 4 with 1 typo', () => {
      return Controller.get({
        name: 'Lamp'
      })
      .then((movies) => {
        expect(movies.models.length).to.eql(1);
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
