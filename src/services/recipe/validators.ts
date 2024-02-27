import Joi from 'joi'
import { type IRecipe } from './types'

const createPayloadValidation = (body: IRecipe): Joi.ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    picture: Joi.string(),
    alcoholLevel: Joi.number().required(),
    alcoholMinLevel: Joi.number().required(),
    alcoholMaxLevel: Joi.number().required(),
    steps: Joi.array().items(Joi.object({
      ingredient: Joi.string().required(),
      proportion: Joi.number().required(),
      orderIndex: Joi.number().required()
    })).required(),
    isAvailable: Joi.boolean().required()
  })
  return schema.validate(body)
}

const findByIdPayloadValidation = (params: { id: IRecipe['id'] }): Joi.ValidationResult => {
  const schema = Joi.object({
    id: Joi.string().length(24).required()
  })
  return schema.validate(params)
}

export {
  createPayloadValidation,
  findByIdPayloadValidation
}
