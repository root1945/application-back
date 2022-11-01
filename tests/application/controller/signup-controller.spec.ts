import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'
import { AddAccount } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { RegistrationError } from '@/domain/errors'
import { SignupController } from '@/application/controllers'
import { EmailValidator } from '@/application/validation'
import { ServerError } from '@/application/errors'

describe('SignupController', () => {
  let sut: SignupController
  let emailValidator: MockProxy<EmailValidator>
  let addAccount: MockProxy<AddAccount>
  let name: string
  let email: string
  let password: string
  let passwordConfirmation: string

  beforeAll(() => {
    emailValidator = mock()
    emailValidator.isValid.mockReturnValue(true)
    addAccount = mock()
    addAccount.perform.mockResolvedValue(new AccessToken('any_token'))
    name = faker.name.firstName()
    email = faker.internet.email()
    password = faker.internet.password()
    passwordConfirmation = password
  })

  beforeEach(() => {
    jest.clearAllMocks()
    sut = new SignupController(emailValidator, addAccount)
  })

  it('should returns 400 if no name is provided', async () => {
    const httpResponse = await sut.handle({ email, password, passwordConfirmation })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('Missing param: name')
    })
  })

  it('should returns 400 if no email is provided', async () => {
    const httpResponse = await sut.handle({ name, password, passwordConfirmation })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('Missing param: email')
    })
  })

  it('should call EmailValidator with correct email', async () => {
    await sut.handle({ name, email, password, passwordConfirmation })

    expect(emailValidator.isValid).toHaveBeenCalledWith(email)
    expect(emailValidator.isValid).toHaveBeenCalledTimes(1)
  })

  it('should returns 400 if email is invalid', async () => {
    emailValidator.isValid.mockReturnValueOnce(false)
    const httpResponse = await sut.handle({ name, email, password, passwordConfirmation })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('Invalid param: email')
    })
  })

  it('should returns 400 if no password is provided', async () => {
    const httpResponse = await sut.handle({ name, email, passwordConfirmation })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('Missing param: password')
    })
  })

  it('should returns 400 if no passwordConfirmation is provided', async () => {
    const httpResponse = await sut.handle({ name, email, password })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('Missing param: passwordConfirmation')
    })
  })

  it('should returns 400 if passwordConfirmation fails', async () => {
    const httpResponse = await sut.handle({ name, email, password, passwordConfirmation: faker.internet.password() })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('Invalid param: passwordConfirmation')
    })
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
