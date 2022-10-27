import { faker } from '@faker-js/faker'
import { EmailValidator } from '@/application/validation'
import { mock, MockProxy } from 'jest-mock-extended'
import { AddAccount } from '@/domain/features'
import { AccessToken } from '@/domain/models'

type HttpRequest = any

type HttpResponse = {
  statusCode: number
  data: any
}

class ServerError extends Error {
  constructor (err?: Error) {
    super('Internal server error')
    this.name = 'ServerError'
    this.stack = err?.stack
  }
}

class SignupController {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
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

      if (password !== passwordConfirmation) {
        return {
          statusCode: 400,
          data: new Error('Invalid param: passwordConfirmation')
        }
      }
      const accessToken = await this.addAccount.perform({ name, email, password })
      if (accessToken instanceof AccessToken){
        return {
          statusCode: 200,
          data: {
            accessToken: accessToken.value
          }
        }
      } else {
        return {
          statusCode: 400,
          data: accessToken
        }
      }
    } catch (err: any) {
      return {
        statusCode: 500,
        data: new ServerError(err)
      }
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
