const Joi = require("@hapi/joi");

exports.companyValidation = Joi.object({
  company_name: Joi.string().trim().required(),
  company_description: Joi.string().trim().required(),
  phone: Joi.number().required(),
  country_code: Joi.number().required(),
  established_year: Joi.number().required(),
  address1: Joi.string().trim().required(),
  address2: Joi.string().trim().required(),
});
