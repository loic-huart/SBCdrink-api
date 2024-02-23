import { ErrorType, type Slug, type Error } from './types'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IErrorService {}

class ErrorService implements IErrorService {
  public NewAuthorizationError (error: string, slug: Slug): Error {
    return {
      error,
      slug,
      errorType: ErrorType.ErrTypeAuthorization
    }
  }

  public NewForbiddenError (error: string, slug: Slug): Error {
    return {
      error,
      slug,
      errorType: ErrorType.ErrTypeForbidden
    }
  }

  public NewIncorrectInputError (error: string, slug: Slug): Error {
    return {
      error,
      slug,
      errorType: ErrorType.ErrTypeIncorrectInput
    }
  }

  public NewNotFoundError (error: string, slug: Slug): Error {
    return {
      error,
      slug,
      errorType: ErrorType.ErrTypeNotFound
    }
  }

  public NewDuplicateError (error: string, slug: Slug): Error {
    return {
      error,
      slug,
      errorType: ErrorType.ErrTypeDuplicate
    }
  }

  public NewUnknowError (error: string, slug: Slug): Error {
    return {
      error,
      slug,
      errorType: ErrorType.ErrTypeUnknow
    }
  }
}

export default ErrorService
