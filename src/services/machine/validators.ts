import Joi from 'joi'
import { IOrder } from '../order/types'

const directMakeCocktailPayloadValidation = (body: IOrder): Joi.ValidationResult => {
  const schema = Joi.object({
    steps: Joi.array().items(Joi.object({
      status: Joi.string().required(),
      orderIndex: Joi.number().required(),
      quantity: Joi.number().required(),
      ingredient: Joi.object({
        name: Joi.string().required(),
        isAlcohol: Joi.boolean().required(),
        alcoholDegree: Joi.number().required()
      }).required()
    })).required()
  })
  return schema.validate(body)
}

export {
  directMakeCocktailPayloadValidation
}
