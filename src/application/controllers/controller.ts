import { HttpResponse, serverError, badRequest } from '@/application/helpers'
import { ValidationComposite, Validator } from '@/application/validation'

export abstract class Controller {
  abstract perform (httpRequest: any): Promise<HttpResponse>

  buildValidators (httpRequest: any): Validator[] {
    return []
  }

  async handle (httpRequest: any): Promise<HttpResponse> {
    const error = this.validate(httpRequest)
    if (error) return badRequest(error)
    try {
      return await this.perform(httpRequest)
    } catch (err: any) {
      console.log(err)
      return serverError(err)
    }
  }

  validate (httpRequest: any): Error | undefined {
    const validators = this.buildValidators(httpRequest)
    return new ValidationComposite(validators).validate()
  }
}
