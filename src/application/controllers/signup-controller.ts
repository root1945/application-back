import { EmailValidator } from '@/application/validation'
import { AddAccount } from '@/domain/features'
import { HttpRequest, HttpResponse } from '@/application/helpers'
import { ServerError } from '@/application/errors'
import { AccessToken } from '@/domain/models'

export class SignupController {
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
