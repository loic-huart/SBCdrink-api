import Joi from 'joi'
import { type ISetting } from './types'

const updatePayloadValidation = (body: ISetting): Joi.ValidationResult => {
  const schema = Joi.object({
    dispenserEmptyingTime: Joi.number().required(),
    dispenserFillingTime: Joi.number().required()
  })
  return schema.validate(body)
}

const createPayloadValidation = (body: ISetting): Joi.ValidationResult => {
  const schema = Joi.object({
    dispenserEmptyingTime: Joi.number().required(),
    dispenserFillingTime: Joi.number().required()
  })
  return schema.validate(body)
}

export {
  updatePayloadValidation,
  createPayloadValidation
}
