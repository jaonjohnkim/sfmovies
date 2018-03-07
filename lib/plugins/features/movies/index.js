'use strict';

const Controller     = require('./controller');
const MovieValidator = require('../../../validators/movie');

exports.register = (server, options, next) => {

  server.route([
    {
      method: 'POST',
      path: '/movies',
      config: {
        handler: (request, reply) => {
          reply(Controller.create(request.payload));
        },
        validate: {
          payload: MovieValidator.post
        }
      }
    },
    {
      method: 'GET',
      path: '/movies',
      config: {
        handler: (request, reply) => {
          reply(Controller.get(request.payload));
        },
        validate: {
          payload: MovieValidator.get
        }
      }
    }
  ]);

  next();

};

exports.register.attributes = {
  name: 'movies'
};
