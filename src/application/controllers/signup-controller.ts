import { EmailValidator, RequiredFields } from '@/application/validation'
import { AddAccount } from '@/domain/features'
import { HttpRequest, HttpResponse } from '@/application/helpers'
import { ServerError, InvalidParamError } from '@/application/errors'
import { AccessToken } from '@/domain/models'

export class SignupController {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validate(httpRequest)
      if (error) {
        return {
          statusCode: 400,
          data: error
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest

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

  validate (httpRequest: HttpRequest): Error | undefined {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    const error = new RequiredFields(requiredFields).validate(httpRequest)
    if (error) {
      return error
    }
    const isValid = this.emailValidator.isValid(httpRequest.email)
    if (!isValid) {
      return new InvalidParamError('email')
    }
  }
}
