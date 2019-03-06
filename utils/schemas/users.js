const Joi = require('joi');

const userIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const createUserSchema = {
  name: Joi.string()
    .required(),
  age: Joi.number()
    .min(1)
    .required(),
  username: Joi.string()
    .required(),
  avatar: Joi.string()
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(10)
    .max(60)
    .required(),
  role: Joi.any()
    .allow(['admin', 'normal'])
    .default('normal')
    .required()
}

const updateUserSchema = {
  name: Joi.string(),
  age: Joi.number()
    .min(1),
  username: Joi.string(),
  avatar: Joi.string(),
  email: Joi.string()
    .email(),
  password: Joi.string(),
  role: Joi.any()
    .allow(['admin', 'normal'])
    .default('normal')
}

module.exports = {
  userIdSchema,
  createUserSchema,
  updateUserSchema
}