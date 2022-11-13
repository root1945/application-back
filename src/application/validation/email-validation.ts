import { EmailValidator } from '@/application/contracts'
import { InvalidParamError } from '@/application/errors'

export class EmailValidation {
  constructor (
    private readonly value: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (): Error | undefined {
    if (!this.emailValidator.isValid(this.value)) {
      return new InvalidParamError('email')
    }
  }
}
