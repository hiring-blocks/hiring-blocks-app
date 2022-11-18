const Joi = require("@hapi/joi");

exports.JobValidation = Joi.object({
  company_id: Joi.string().trim().required(),
  job_title: Joi.string().trim().required(),
  job_description: Joi.string().trim().required(),
  job_type: Joi.string().trim().required(),
  workplace: Joi.string().trim().required(),
  job_location: Joi.string().trim().required(),
});
