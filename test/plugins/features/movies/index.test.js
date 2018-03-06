'use strict';

const Movies = require('../../../../lib/server');

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

  describe('responds with the correct error', () => {

    it('responds with a 422 and correct message for mismatched payload property', () => {
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

  });

});
