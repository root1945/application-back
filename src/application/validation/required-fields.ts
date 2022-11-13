import { MissingParamError } from '@/application/errors'
import { Validator } from '@/application/validation'

export class RequiredFieldsValidation implements Validator {
  constructor (
    private readonly input: any,
    private readonly fieldNames: string[]
  ) {}

  validate (): Error | undefined {
    for (const field of this.fieldNames) {
      if (!this.input[field]) {
        return new MissingParamError(field)
      }
    }
  }
}
