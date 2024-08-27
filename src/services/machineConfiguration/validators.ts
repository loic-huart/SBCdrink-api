import Joi from 'joi'
import { type IMachineConfiguration } from './types'

const updatePayloadValidation = (body: IMachineConfiguration): Joi.ValidationResult => {
  const schema = Joi.object({
    id: Joi.string().length(24).required(),
    ingredientId: Joi.string().length(24).allow(null).required(),
    slot: Joi.number().required(),
    measureVolume: Joi.number().allow(null).required()
  })
  return schema.validate(body)
}

export {
  updatePayloadValidation
}
