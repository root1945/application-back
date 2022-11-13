import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'
import { AddAccount } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { RegistrationError } from '@/domain/errors'
import { SignupController } from '@/application/controllers'
import { ServerError } from '@/application/errors'
import { CompareFieldsValidation, EmailValidation, RequiredFieldsValidation } from '@/application/validation'
import { EmailValidatorAdapter } from '@/utils'

describe('SignupController', () => {
  let sut: SignupController
  let addAccount: MockProxy<AddAccount>
  let name: string
  let email: string
  let password: string
  let passwordConfirmation: string

  beforeAll(() => {
    addAccount = mock()
    addAccount.perform.mockResolvedValue(new AccessToken('any_token'))
    name = faker.name.firstName()
    email = faker.internet.email()
    password = faker.internet.password()
    passwordConfirmation = password
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = new SignupController(addAccount)
  })

  it('should build validators correctly', () => {
    const input = { name, email, password, passwordConfirmation }
    const validators = sut.buildValidators(input)

    expect(validators).toEqual([
      new RequiredFieldsValidation(input, ['name', 'email', 'password', 'passwordConfirmation']),
      new EmailValidation(input.email, new EmailValidatorAdapter()),
      new CompareFieldsValidation(input, 'password', 'passwordConfirmation')
    ])
  })

  it('should call AddAccount with correct values', async () => {
    await sut.handle({ name, email, password, passwordConfirmation })

    expect(addAccount.perform).toHaveBeenCalledWith({ name, email, password })
    expect(addAccount.perform).toHaveBeenCalledTimes(1)
  })

  it('should return 400 if Registration fails', async () => {
    addAccount.perform.mockResolvedValueOnce(new RegistrationError())

    const httpResponse = await sut.handle({ name, email, password, passwordConfirmation })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RegistrationError()
    })
  })

  it('should return 200 if AddAccount succeeds', async () => {
    const httpResponse = await sut.handle({ name, email, password, passwordConfirmation })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { accessToken: 'any_token' }
    })
  })

  it('should returns 500 if AddAccount throws', async () => {
    addAccount.perform.mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle({ name, email, password, passwordConfirmation })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError()
    })
  })
})
