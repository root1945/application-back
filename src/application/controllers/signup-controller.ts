import { RequiredFieldsValidation, CompareFieldsValidation } from '@/application/validation'
import { AddAccount } from '@/domain/features'
import { HttpResponse, badRequest, ok, serverError } from '@/application/helpers'
import { InvalidParamError } from '@/application/errors'
import { AccessToken } from '@/domain/models'
import { EmailValidator } from '@/application/contracts'

type HttpRequest = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

type Model = Error | {
  accessToken: string
}

export class SignupController {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const error = this.validate(httpRequest)
      if (error) return badRequest(error)
      const { name, email, password } = httpRequest
      const accessToken = await this.addAccount.perform({ name, email, password })
      if (accessToken instanceof AccessToken){
        return ok({ accessToken: accessToken.value })
      } else {
        return badRequest(accessToken)
      }
    } catch (err: any) {
      return serverError(err)
    }
  }

  validate (httpRequest: HttpRequest): Error | undefined {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    const requiredFieldsValidation = new RequiredFieldsValidation(requiredFields)
    const error = requiredFieldsValidation.validate(httpRequest)
    if (error) {
      return error
    }
    const { email } = httpRequest
    if (!this.emailValidator.isValid(email)) {
      return new InvalidParamError('email')
    }
    const { password, passwordConfirmation } = httpRequest
    const compareFieldsValidation = new CompareFieldsValidation('password', 'passwordConfirmation')
    if (compareFieldsValidation.validate({ password, passwordConfirmation })) {
      return new InvalidParamError('passwordConfirmation')
    }
  }
}
