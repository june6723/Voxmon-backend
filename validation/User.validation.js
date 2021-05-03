import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
  username: Joi.string().min(2).max(20).pattern(new RegExp('^[^\\s]+$'))
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required()
})  