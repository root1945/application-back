import { ValidationBuilder as Builder, Validator } from '@/application/validation'
import { AddAccount } from '@/domain/features'
import { HttpResponse, badRequest, ok } from '@/application/helpers'
import { AccessToken } from '@/domain/models'
import { Controller } from '@/application/controllers'

type HttpRequest = {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

type Model = Error | {
  accessToken: string
}

export class SignupController extends Controller {
  constructor (private readonly addAccount: AddAccount) {
    super()
  }

  async perform (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const { name, email, password } = httpRequest
    const accessToken = await this.addAccount.perform({ name, email, password })
    return accessToken instanceof AccessToken ? ok({ accessToken: accessToken.value }) : badRequest(accessToken)
  }

  override buildValidators (httpRequest: any): Validator[] {
    return [
      ...Builder.of({ value: httpRequest, fieldNames: ['name', 'email', 'password', 'passwordConfirmation'] }).required().build(),
      ...Builder.of({ value: httpRequest, fieldName: 'email' }).isValidEmail().build(),
      ...Builder.of({ value: httpRequest, fieldName: 'password', fieldNameToCompare: 'passwordConfirmation' }).compare().build()
    ]
  }
}
