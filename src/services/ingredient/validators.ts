import Joi from 'joi'

const createPayloadValidation = (body: unknown): Joi.ValidationResult => {
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
