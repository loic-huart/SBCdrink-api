import Joi from 'joi'
import { type IIngredient } from './types'

const createPayloadValidation = (body: IIngredient): Joi.ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().required(),
    isAlcohol: Joi.boolean().required(),
    alcoholDegree: Joi.number().required()
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
  findByIdPayloadValidation
}
