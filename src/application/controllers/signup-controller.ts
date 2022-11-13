import { ValidationComposite, ValidationBuilder } from '@/application/validation'
import { AddAccount } from '@/domain/features'
import { HttpResponse, badRequest, ok, serverError } from '@/application/helpers'
import { AccessToken } from '@/domain/models'

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
    return new ValidationComposite([
      ...ValidationBuilder.of({ value: httpRequest, fieldNames: ['name', 'email', 'password', 'passwordConfirmation'] }).required().build(),
      ...ValidationBuilder.of({ value: httpRequest, fieldName: 'email' }).isValidEmail().build(),
      ...ValidationBuilder.of({ value: httpRequest, fieldName: 'password', fieldNameToCompare: 'passwordConfirmation' }).compare().build()
    ]).validate()
  }
}
