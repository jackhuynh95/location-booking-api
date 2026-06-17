import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SSL: Joi.boolean().default(false),
  DB_SYNCHRONIZE: Joi.boolean()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.valid(false),
      otherwise: Joi.boolean(),
    })
    .default(false)
    .messages({
      'any.only': 'DB_SYNCHRONIZE must be false in production',
    }),
  DB_MIGRATIONS_RUN: Joi.boolean().default(true),
  DB_LOGGING: Joi.boolean().default(false),
  DB_POOL_MAX: Joi.number().integer().min(1).default(10),
  DB_POOL_IDLE_TIMEOUT_MS: Joi.number().integer().min(1000).default(30000),
  DB_POOL_CONNECTION_TIMEOUT_MS: Joi.number().integer().min(1000).default(5000),
});
