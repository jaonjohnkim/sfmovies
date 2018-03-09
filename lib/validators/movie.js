'use strict';

const Joi = require('joi');

const create = Joi.object().keys({
  title: Joi.string().min(1).max(255).required(),
  release_year: Joi.number().integer().min(1878).max(9999).optional()
});

const get = Joi.object().keys({
  id: Joi.number().integer().min(1).optional(),
  title: Joi.string().min(1).max(255).optional(),
  release_year: Joi.number().integer().min(1878).max(9999).optional(),
  release_year_range: Joi.string().regex(/^((187[89])|(18[89]\d)|(19\d\d)|([2-9]\d\d\d))\-((187[89])|(18[89]\d)|(19\d\d)|([2-9]\d\d\d))$/).optional()
}).or(['title', 'release_year', 'release_year_range', 'id']);

module.exports = {
  create,
  get
};
