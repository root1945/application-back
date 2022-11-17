import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'
import { Authentication } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'
import { AuthenticationController } from '@/application/controllers'
import { ServerError, UnauthorizedError } from '@/application/errors'
import { EmailValidation, RequiredFieldsValidation } from '@/application/validation'
import { EmailValidatorAdapter } from '@/utils'

describe('AuthenticationController', () => {
  let sut: AuthenticationController
  let authentication: MockProxy<Authentication>
  let email: string
  let password: string

  beforeAll(() => {
    authentication = mock()
    authentication.perform.mockResolvedValue(new AccessToken('any_token'))
    email = faker.internet.email()
    password = faker.internet.password()
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = new AuthenticationController(authentication)
  })

  it('should build validators correctly', () => {
    const input = { email, password }
    const validators = sut.buildValidators(input)

    expect(validators).toEqual([
      new RequiredFieldsValidation(input, ['email', 'password']),
      new EmailValidation(input.email, new EmailValidatorAdapter())
    ])
  })

  it('should call Authentication with correct values', async () => {
    await sut.handle({ email, password })

    expect(authentication.perform).toHaveBeenCalledWith({ email, password })
    expect(authentication.perform).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if Authentication fails', async () => {
    authentication.perform.mockResolvedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('should return 200 if Authentication succeeds', async () => {
    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { accessToken: 'any_token' }
    })
  })

  it('should returns 500 if Authentication throws', async () => {
    authentication.perform.mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError()
    })
  })
})
