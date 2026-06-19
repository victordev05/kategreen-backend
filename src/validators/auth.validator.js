const Joi = require("joi");

const registerSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("CUSTOMER", "FARMER", "LOGISTICS", "ADMIN"),
});

module.exports = {
  registerSchema,
};