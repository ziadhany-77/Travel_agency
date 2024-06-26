import Joi from "joi";

export const addPlaceSchema = Joi.object({
  body: {
    name: Joi.string().max(20).min(2).trim().required(),
    type: Joi.array().items(Joi.string()),
  },
  params: {},
  query: {},
  file: Joi.object().required(),
});
export const updatePlaceSchema = Joi.object({
  body: {
    name: Joi.string().max(20).min(2).trim(),
    type: Joi.array().items(Joi.string()),
  },
  params: { placeId: Joi.string().hex().length(24) },
  query: {},
});

export const deletePlaceSchema = Joi.object({
  body: {},
  params: { placeId: Joi.string().hex().length(24) },
  query: {},
});
