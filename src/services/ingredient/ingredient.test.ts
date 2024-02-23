
import AuthService from './ingredient'
import { Slug } from '../errors/types'
import dbConnect from '../../lib/mongoose'
import User from '../../models/Ingredient'
import UserToken from '../../models/UserToken'

const mockCredentials = [
  {
    name: 'John Smith',
    email: 'johnsmith@test.com',
    password: 'password' // invalid password
  },
  {
    name: 'Jane Doe',
    email: 'johnsmith@test.com', // same email
    password: 'Azerty123.'
  },
  {
    name: 'John Doe',
    email: 'johndoe@test.com',
    password: 'Azerty123.'
  }
]

const Auth = new AuthService()

const clearUserDatabase = async (): Promise<void> => {
  void await User.deleteMany()
  void await UserToken.deleteMany()
}

describe('Auth Service Unit tests', () => {
  beforeAll(async () => {
    await dbConnect()
  })

  describe('Sign up', () => {
    beforeEach(async () => {
      await clearUserDatabase()
    })

    afterEach(async () => {
      await clearUserDatabase()
    })

    it('Should return an error if password does not contain at least 1 upper-cased letter', async () => {
      await expect(Auth.signUp(mockCredentials[0])).resolves.toStrictEqual({
        accessToken: '',
        refreshToken: '',
        error: Auth.NewIncorrectInputError('"Password" should contain at least 1 upper-cased letter', Slug.ErrIncorrectInput)
      })
    })

    it('Should return a token', async () => {
      const { accessToken, refreshToken } = await Auth.signUp(mockCredentials[1])
      const { tokenDetails } = await Auth.verifyRefreshToken(refreshToken)

      const { email, password, name } = mockCredentials[1]
      const hashedPassword = await Auth.hashPassword(password)

      const user = await User.findOne({ _id: tokenDetails._id })
      void expect(Auth.comparePassword(password, hashedPassword)).resolves.toBe(true)
      expect({
        _id: user?.id,
        email: user?.email,
        name: user?.name,
        roles: user?.roles
      }).toStrictEqual({
        _id: tokenDetails._id,
        email,
        name,
        roles: tokenDetails.roles
      })
    })

    it('Should return an error if email is already used by another user', async () => {
      await Auth.signUp(mockCredentials[1])
      await expect(Auth.signUp(mockCredentials[1])).resolves.toStrictEqual({
        accessToken: '',
        refreshToken: '',
        error: Auth.NewDuplicateError('User already exists', Slug.ErrUserAlreadyExist)
      })
    })
  })

  describe('Log in', () => {
    it('Should return an error if email is not used by any user', async () => {
      const { email, password } = mockCredentials[0]
      await expect(Auth.logIn({ email, password })).resolves.toStrictEqual({
        accessToken: '',
        refreshToken: '',
        error: Auth.NewAuthorizationError('Invalid credentials', Slug.ErrInvalidCredentials)
      })
    })
    it('Should return a token', async () => {
      await Auth.signUp(mockCredentials[2])
      const { email, password, name } = mockCredentials[2]
      const { accessToken, refreshToken } = await Auth.logIn({ email, password })

      const { tokenDetails } = await Auth.verifyRefreshToken(refreshToken)
      const user = await User.findOne({ _id: tokenDetails._id })
      expect({
        _id: user?.id,
        email: user?.email,
        name: user?.name,
        roles: user?.roles
      }).toStrictEqual({
        _id: tokenDetails._id,
        email,
        name,
        roles: tokenDetails.roles
      })
    })
  })

  describe('refresh token', () => {
    it('Should return an error if token is invalid', async () => {
      await Auth.signUp(mockCredentials[2])
      const { email, password } = mockCredentials[2]
      const { refreshToken } = await Auth.logIn({ email, password })
      await UserToken.deleteMany()
      await expect(Auth.refreshToken({ refreshToken })).resolves.toStrictEqual({
        accessToken: '',
        refreshToken: '',
        error: Auth.NewAuthorizationError('Invalid refresh token', Slug.ErrInvalidRefleshToken)
      })
    })

    it('Should return a token if token is valid', async () => {
      await Auth.signUp(mockCredentials[2])
      const { email, password, name } = mockCredentials[2]
      const { refreshToken } = await Auth.logIn({ email, password })
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await Auth.refreshToken({ refreshToken })
      const { tokenDetails } = await Auth.verifyRefreshToken(newRefreshToken)
      const user = await User.findOne({ _id: tokenDetails._id })
      expect({
        _id: user?.id,
        email: user?.email,
        name: user?.name,
        roles: user?.roles
      }).toStrictEqual({
        _id: tokenDetails._id,
        email,
        name,
        roles: tokenDetails.roles
      })
    })
  })

  describe('log out', () => {
    it('Should return success message', async () => {
      await Auth.signUp(mockCredentials[2])
      const { email, password } = mockCredentials[2]
      const { refreshToken } = await Auth.logIn({ email, password })
      const { error } = await Auth.logOut({ refreshToken })
      expect(error).toBeUndefined()
    })
  })
})
