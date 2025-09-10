import Joi from 'joi';

export const postHeroValidation = Joi.object({
  id: Joi.number(),
  nickname: Joi.string().required().min(3).max(50),
  real_name: Joi.string().min(2).max(100).required(),
  origin_description: Joi.string().min(2).required(),
  superpowers: Joi.string().required(),
  catch_phrase: Joi.string().required(),
  images: Joi.array().items(Joi.string().uri()),
});

export const putHeroValidation = Joi.object({
  nickname: Joi.string().required().min(3).max(50),
  real_name: Joi.string().min(2).max(100).required(),
  origin_description: Joi.string().min(2).required(),
  superpowers: Joi.string().required(),
  catch_phrase: Joi.string().required(),
  images: Joi.array().items(Joi.string().uri()),
});
