import { ErrorType } from '../services/errors/types'

const mapErrorTypeToHttpCode = (errorType: ErrorType): number => {
  switch (errorType) {
    case ErrorType.ErrTypeAuthorization:
      return 401
    case ErrorType.ErrTypeForbidden:
      return 403
    case ErrorType.ErrTypeIncorrectInput:
      return 400
    case ErrorType.ErrTypeNotFound:
      return 404
    case ErrorType.ErrTypeDuplicate:
      return 409
    case ErrorType.ErrTypeUnknow:
      return 500
    default:
      return 500
  }
}

export default mapErrorTypeToHttpCode
