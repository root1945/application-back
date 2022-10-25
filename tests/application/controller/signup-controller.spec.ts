import { faker } from '@faker-js/faker'

type HttpRequest = any

type HttpResponse = {
  statusCode: number
  data: any
}

class SignupController {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { name, email, password } = httpRequest
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
    if (!password) {
      return {
        statusCode: 400,
        data: new Error('Missing param: password')
      }
    }
    return {
      statusCode: 400,
      data: new Error('Missing param: passwordConfirmation')
    }
  }
}

describe('SignupController', () => {
  let sut: SignupController
  let name: string
  let email: string
  let password: string
  let passwordConfirmation: string

  beforeAll(() => {
    name = faker.name.firstName()
    email = faker.internet.email()
    password = faker.internet.password()
    passwordConfirmation = password
  })

  beforeEach(() => {
    sut = new SignupController()
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
})
