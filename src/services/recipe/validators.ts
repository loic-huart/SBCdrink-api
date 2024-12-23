import Joi from 'joi'
import { type IRecipe } from './types'

const createPayloadValidation = (body: IRecipe): Joi.ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    pictureId: Joi.string().allow(null).required(),
    alcoholLevel: Joi.number().required(),
    alcoholMinLevel: Joi.number().required(),
    alcoholMaxLevel: Joi.number().required(),
    defaultGlassVolume: Joi.number().required(),
    steps: Joi.array().items(Joi.object({
      ingredientId: Joi.string().required(),
      proportion: Joi.number().required(),
      orderIndex: Joi.number().required()
    })).required()
  })
  return schema.validate(body)
}

const findByIdPayloadValidation = (params: { id: IRecipe['id'] }): Joi.ValidationResult => {
  const schema = Joi.object({
    id: Joi.string().length(24).required()
  })
  return schema.validate(params)
}

const updatePayloadValidation = (body: IRecipe): Joi.ValidationResult => {
  const schema = Joi.object({
    id: Joi.string().length(24).required(),
    name: Joi.string(),
    description: Joi.string(),
    pictureId: Joi.string().allow(null).required(),
    alcoholLevel: Joi.number(),
    alcoholMinLevel: Joi.number(),
    alcoholMaxLevel: Joi.number(),
    defaultGlassVolume: Joi.number(),
    steps: Joi.array().items(Joi.object({
      id: Joi.string().length(24),
      ingredientId: Joi.string().required(),
      proportion: Joi.number().required(),
      orderIndex: Joi.number().required()
    })),
    isAvailable: Joi.boolean(),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
  })
  return schema.validate(body)
}

export {
  createPayloadValidation,
  findByIdPayloadValidation,
  updatePayloadValidation
}
