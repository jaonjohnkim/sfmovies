'use strict';

const Joi = require('joi');

const post = Joi.object().keys({
  title: Joi.string().min(1).max(255).required(),
  release_year: Joi.number().integer().min(1878).max(9999).optional()
});

const get = Joi.object().keys({
  id: Joi.number().integer().min(1).optional(),
  title: Joi.string().min(1).max(255).optional(),
  release_year: Joi.number().integer().min(1878).max(9999).optional()
});

module.exports = {
  post,
  get
};
