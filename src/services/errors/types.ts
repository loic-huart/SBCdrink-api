enum Slug {
  ErrRecipeNotFound = 'RECIPE_NOT_FOUND',
  ErrIngredientNotFound = 'INGREDIENT_NOT_FOUND',

  ErrOrderAlreadyInStatusCreated = 'ORDER_ALREADY_IN_STATUS_CREATED',

  ErrIncorrectInput = 'INVALID_INPUT',

  ErrInvalidEmail = 'INVALID_EMAIL',
  ErrInvalidPassword = 'INVALID_PASSWORD',
  ErrInvalidCredentials = 'INVALID_CREDENTIALS',
  ErrExpiredToken = 'EXPIRED_TOKEN',
  ErrInvalidRefleshToken = 'INVALID_REFRESH_TOKEN',
  ErrUserAlreadyExist = 'USER_ALREADY_EXIST',
  ErrUnknow = 'UNKNOW',
}

enum ErrorType {
  ErrTypeUnknow = 'unknow',
  ErrTypeAuthorization = 'authorization',
  ErrTypeForbidden = 'forbidden',
  ErrTypeIncorrectInput = 'incorrect-input',
  ErrTypeNotFound = 'not-found',
  ErrTypeDuplicate = 'duplicate',
}

interface Error {
  error: string
  slug: Slug
  errorType: ErrorType
}

export { Slug, ErrorType, type Error }
