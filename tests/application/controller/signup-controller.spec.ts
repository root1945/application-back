import { faker } from '@faker-js/faker'
import { EmailValidator } from '@/application/validation'
import { mock, MockProxy } from 'jest-mock-extended'
import { AddAccount } from '@/domain/features'

type HttpRequest = any

type HttpResponse = {
  statusCode: number
  data: any
}

class SignupController {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, email, password, passwordConfirmation } = httpRequest
    if (!name) {
      return {
        statusCode: 400,
        data: new Error('Missing param: name')
      }
    }
    if (!email) {
      return {
        statusCode: 400,
        data: new Error('Missing param: email')
      }
    }
    const isValid = this.emailValidator.isValid(email)
    if (!isValid) {
      return {
        statusCode: 400,
        data: new Error('Invalid param: email')
      }
    }
    if (!password) {
      return {
        statusCode: 400,
        data: new Error('Missing param: password')
      }
    }
    if (!passwordConfirmation) {
      return {
        statusCode: 400,
        data: new Error('Missing param: passwordConfirmation')
      }
    }
    await this.addAccount.perform({ name, email, password })
    return {
      statusCode: 400,
      data: new Error('Invalid param: passwordConfirmation')
    }
  }
}

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
})
