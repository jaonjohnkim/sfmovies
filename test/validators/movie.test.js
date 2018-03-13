'use strict';

const Joi = require('joi');

const MovieValidator = require('../../lib/validators/movie');

describe('movie validator', () => {

  describe('post/create', () => {

    describe('title', () => {

      it('is required', () => {
        const payload = {};
        const result = Joi.validate(payload, MovieValidator.create);

        expect(result.error.details[0].path).to.eql('title');
        expect(result.error.details[0].type).to.eql('any.required');
      });

      it('is less than 255 characters', () => {
        const payload = { title: 'a'.repeat(260) };
        const result = Joi.validate(payload, MovieValidator.create);

        expect(result.error.details[0].path).to.eql('title');
        expect(result.error.details[0].type).to.eql('string.max');
      });

    });

    describe('release_year', () => {

      it('is after 1878', () => {
        const payload = {
          title: 'foo',
          release_year: 1800
        };
        const result = Joi.validate(payload, MovieValidator.create);

        expect(result.error.details[0].path).to.eql('release_year');
        expect(result.error.details[0].type).to.eql('number.min');

      });

      it('is limited to 4 digits', () => {
        const payload = {
          title: 'foo',
          release_year: 12345
        };
        const result = Joi.validate(payload, MovieValidator.create);

        expect(result.error.details[0].path).to.eql('release_year');
        expect(result.error.details[0].type).to.eql('number.max');
      });

    });

  });

  describe('get', () => {

    describe('id', () => {

      it('is greater than 0', () => {
        const payload = { id: -1 };
        const result = Joi.validate(payload, MovieValidator.get);

        expect(result.error.details[0].path).to.eql('id');
        expect(result.error.details[0].type).to.eql('number.min');
      });

    });

    describe('title', () => {

      it('is less than 255 characters', () => {
        const payload = { title: 'a'.repeat(260) };
        const result = Joi.validate(payload, MovieValidator.get);

        expect(result.error.details[0].path).to.eql('title');
        expect(result.error.details[0].type).to.eql('string.max');
      });

    });

    describe('release_year', () => {

      it('is after 1878', () => {
        const payload = {
          title: 'foo',
          release_year: 1800
        };
        const result = Joi.validate(payload, MovieValidator.get);

        expect(result.error.details[0].path).to.eql('release_year');
        expect(result.error.details[0].type).to.eql('number.min');
      });

      it('is limited to 4 digits', () => {
        const payload = {
          title: 'foo',
          release_year: 12345
        };
        const result = Joi.validate(payload, MovieValidator.get);

        expect(result.error.details[0].path).to.eql('release_year');
        expect(result.error.details[0].type).to.eql('number.max');
      });

    });

    describe('release_year_range', () => {

      it('is after 1878', () => {
        const payload = {
          title: 'foo',
          release_year_range: '1800-1820'
        };
        const result = Joi.validate(payload, MovieValidator.get);

        expect(result.error.details[0].path).to.eql('release_year_range');
        expect(result.error.details[0].type).to.eql('string.regex.base');
      });

    });

  });

});
