import Joi from "joi";
import { GENDER, ROLES } from "../../../../utils/enums.js";

export const signinSchema = Joi.object({
  body: {
    email: Joi.string().required(),
    password: Joi.string().required(),
  },
  params: {},
  query: {},
});

export const signupSchema = Joi.object({
  body: {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    dateOfBirth: Joi.date(),
    gender: Joi.string().valid(GENDER.MALE, GENDER.FEMALE),
  },
  params: {},
  query: {},
});

export const validateEmailSchema = Joi.object({
  body: {},
  params: {
    token: Joi.string().hex().length(24),
  },
  query: {},
});
