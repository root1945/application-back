import { ValidationBuilder as Builder, Validator } from '@/application/validation'
import { Authentication } from '@/domain/features'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { AccessToken } from '@/domain/models'
import { Controller } from '@/application/controllers'

type HttpRequest = {
  email: string
  password: string
}

type Model = Error | {
  accessToken: string
}

export class AuthenticationController extends Controller {
  constructor (private readonly authentication: Authentication) {
    super()
  }

  async perform (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const { email, password } = httpRequest
    const accessToken = await this.authentication.perform({ email, password })
    return accessToken instanceof AccessToken ? ok({ accessToken: accessToken.value }) : unauthorized()
  }

  override buildValidators (httpRequest: any): Validator[] {
    return [
      ...Builder.of({ value: httpRequest, fieldNames: ['email', 'password'] }).required().build(),
      ...Builder.of({ value: httpRequest, fieldName: 'email' }).isValidEmail().build()
    ]
  }
}
