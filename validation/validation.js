const Joi = require("joi");

const signUpValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    // phoneNumber: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
    // role: Joi.string(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const newPassValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    resetLink: Joi.string().required(),
    otp: Joi.required(),
    newPass: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports.signUpValidation = signUpValidation;
module.exports.loginValidation = loginValidation;
module.exports.newPassValidation = newPassValidation;