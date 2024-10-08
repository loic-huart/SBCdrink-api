import Joi from 'joi'
import { type IIngredient } from './types'

const createPayloadValidation = (body: IIngredient): Joi.ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().required(),
    isAlcohol: Joi.boolean().required(),
    alcoholDegree: Joi.number().required(),
    viscosity: Joi.number().required()
  })
  return schema.validate(body)
}

const updatePayloadValidation = (body: IIngredient): Joi.ValidationResult => {
  const schema = Joi.object({
    id: Joi.string().length(24).required(),
    name: Joi.string().required(),
    isAlcohol: Joi.boolean().required(),
    alcoholDegree: Joi.number().required(),
    viscosity: Joi.number().required(),
    createdAt: Joi.date(),
    updatedAt: Joi.date()
  })
  return schema.validate(body)
}

const findByIdPayloadValidation = (params: { id: IIngredient['id'] }): Joi.ValidationResult => {
  const schema = Joi.object({
    id: Joi.string().length(24).required()
  })
  return schema.validate(params)
}

export {
  createPayloadValidation,
  updatePayloadValidation,
  findByIdPayloadValidation
}
