import { faker } from '@faker-js/faker'
import { mock, MockProxy } from 'jest-mock-extended'
import { AddAccount } from '@/domain/features'
import { AccessToken } from '@/domain/models'
import { RegistrationError } from '@/domain/errors'
import { SignupController } from '@/application/controllers'
import { EmailValidator } from '@/application/contracts'
import { ServerError } from '@/application/errors'
import { RequiredFieldsValidation } from '@/application/validation'

jest.mock('@/application/validation/required-fields')

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

  it('should returns 400 if validation fails', async () => {
    const error = new Error('validation_error')
    jest.spyOn(RequiredFieldsValidation.prototype, 'validate').mockReturnValueOnce(error)

    const httpResponse = await sut.handle({ name, email, password, passwordConfirmation })

    expect(RequiredFieldsValidation).toHaveBeenCalledWith(['name', 'email', 'password', 'passwordConfirmation'])
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
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
