const Joi = require("@hapi/joi");

exports.ContactValidation = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().required().email(),
  subject: Joi.string().trim().required(),
  message: Joi.string().trim().required(),
});
