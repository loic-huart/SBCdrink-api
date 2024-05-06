import Joi from 'joi'
import { type ImageObject } from './types'

const createPayloadValidation = (body: ImageObject): Joi.ValidationResult => {
  const schema = Joi.object({
    filename: Joi.string().required(),
    fieldname: Joi.string().required(),
    file: Joi.any().required(),
    mimetype: Joi.string().valid('image/jpg', 'image/jpeg', 'image/png', 'image/webp').required()
  })
  return schema.validate(body, { allowUnknown: true })
}

export {
  createPayloadValidation
}
