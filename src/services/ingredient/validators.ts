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

export {
  createPayloadValidation
}
