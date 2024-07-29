import Joi from 'joi'
import { type IPayloadFindById } from './service'

const createPayloadValidation = <T>(body: T): Joi.ValidationResult => {
  const schema = Joi.object({})
  return schema.validate(body)
}

const updatePayloadValidation = <T>(body: T): Joi.ValidationResult => {
  const schema = Joi.object({
    id: Joi.string().length(24).required()
  })
  return schema.validate(body)
}

const findByIdPayloadValidation = (params: { id: IPayloadFindById['id'] }): Joi.ValidationResult => {
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
