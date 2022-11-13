import { InvalidParamError } from '@/application/errors'
import { Validator } from '@/application/validation'

export class CompareFieldsValidation implements Validator {
  constructor (
    private readonly input: any,
    readonly field: string,
    readonly fieldToCompare: string
  ) {}

  validate (): Error | undefined {
    return this.input[this.field] !== this.input[this.fieldToCompare]
      ? new InvalidParamError(this.fieldToCompare)
      : undefined
  }
}
