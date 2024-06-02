import Joi from 'joi'
import { type IOrderMakeCocktail } from '../order/types'

const directMakeCocktailPayloadValidation = (body: IOrderMakeCocktail): Joi.ValidationResult => {
  const schema = Joi.object({
    steps: Joi.array().items(Joi.object({
      id: Joi.string(),
      status: Joi.string().required(),
      orderIndex: Joi.number().required(),
      quantity: Joi.number().required(),
      ingredient: Joi.object({
        id: Joi.string(),
        name: Joi.string().required(),
        isAlcohol: Joi.boolean().required(),
        alcoholDegree: Joi.number().required(),
        updatedAt: Joi.date().required(),
        createdAt: Joi.date().required()
      }).required()
    })).required()
  })
  return schema.validate(body)
}

export {
  directMakeCocktailPayloadValidation
}
