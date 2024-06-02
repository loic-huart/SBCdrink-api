import Joi from 'joi'
import { type IOrder } from './types'

const createPayloadValidation = (body: IOrder): Joi.ValidationResult => {
  const schema = Joi.object({
    recipe: Joi.string().required(),
    steps: Joi.array().items(Joi.object({
      orderIndex: Joi.number().required(),
      quantity: Joi.number().required(),
      ingredient: Joi.string().required()
    })).required()
  })
  return schema.validate(body)
}

export {
  createPayloadValidation
}
