import Joi from "joi";

export const sendCargoShcema = Joi.object({
  from: Joi.string().hex().length(24).required(),
  to: Joi.string().hex().length(24).required(),
  description: Joi.string().min(3).max(300).required().trim(),
  breakable: Joi.boolean().required(),
});
