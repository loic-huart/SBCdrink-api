import Joi from 'joi'
import { OrderStatus, type IOrder } from './types'

const createPayloadValidation = (body: IOrder): Joi.ValidationResult => {
  const schema = Joi.object({
    status: Joi.string().valid(...Object.values(OrderStatus)).required(),
    progress: Joi.number().required(),
    recipe: Joi.string().required(),
    steps: Joi.array().items(Joi.object({
      status: Joi.string().valid(...Object.values(OrderStatus)).required(),
      order: Joi.number().required(),
      quantity: Joi.number().required(),
      ingredient: Joi.string().required()
    })).required()
  })
  return schema.validate(body)
}

export {
  createPayloadValidation
}
